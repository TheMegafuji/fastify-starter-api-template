import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './plugins/errorHandler';
import routes from './routes';
import { initializeConnections, disconnectConnections, cacheService } from './config/redis.config';


export function buildServer() {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
    ajv: {
      plugins: [
        (ajv) => {
          ajv.addKeyword({
            keyword: 'example',
            metaSchema: {},
            validate: () => true,
          });
        },
      ],
    },
  });

  app.register(cors, {});
  app.register(helmet, { contentSecurityPolicy: false });

  app.register(rateLimit, { 
    max: 100, 
    timeWindow: '1 minute',
    redis: process.env.RATE_LIMIT_REDIS_URL ? undefined : cacheService,
    skipOnError: true
  });

  app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Documentação da API Fastify Starter',
        description: `
            Esta API serve como backend para o Template da API Fastify Starter.

            Ela fornece os seguintes endpoints:
            
            - Saúde: Verifica a saúde da API e conectividade do banco de dados (/healthcheck)
            - Autenticação: Login e emissão de token (/auth/login)
            - Jogador: Cria e gerencia jogadores (/player)
            - Ranking: Recupera rankings de jogadores com paginação e filtros (/ranking)
            - Monstro: Executa caçadas autorizadas a monstros (/monster-hunt)

            Construída com Fastify, TypeORM, PostgreSQL e protegida com autenticação JWT.
        `,
        version: '1.0.0',
        contact: {
          name: 'Equipe de Suporte',
          email: 'support@example.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development Server'
        },
        {
          url: 'https://api.example.com',
          description: 'Production Server'
        }
      ],
      tags: [
        { name: 'Health', description: 'Endpoints para verificar a conectividade da API e banco de dados' },
        { name: 'Authentication', description: 'Endpoints relacionados à autenticação de usuários' },
        { name: 'Player', description: 'Endpoints para criação e gerenciamento de jogadores' },
        { name: 'Ranking', description: 'Endpoints para buscar rankings de jogadores' },
        { name: 'Monster', description: 'Endpoints para executar caçadas a monstros' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Encontre mais informações aqui'
      }
    }
  })

  app.register(swaggerUi, {
    routePrefix: '/',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  app.addHook('onReady', async () => {
    await initializeConnections();
    app.log.info('Database and cache services connected via onReady hook');
  });

  app.setErrorHandler(errorHandler);

  app.register(require('./plugins/auth').default);
  app.register(routes);

  return app;
}

export default buildServer();

process.on('SIGINT', async () => {
  await disconnectConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectConnections();
  process.exit(0);
});
