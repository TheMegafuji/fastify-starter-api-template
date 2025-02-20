import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './plugins/errorHandler';
import routes from './routes';
import { connect, disconnect } from './config/db.config';


export function buildServer() {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
  });

  app.register(cors, {});
  app.register(helmet, { contentSecurityPolicy: false });

  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fastify Starter API Documentation',
        description: `
            This API serves as the backend for the Fastify Starter API Template.

            It provides the following endpoints:
            
            - Health: Check the API's health and database connectivity (/healthcheck)
            - Authentication: Login and token issuance (/auth/login) 
            - Player: Create and manage players (/player)
            - Ranking: Retrieve player rankings with pagination and filters (/ranking)
            - Monster: Execute authorized monster hunts (/monster-hunt)

            Built with Fastify, TypeORM, PostgreSQL, and secured with JWT authentication.
        `,
        version: '1.0.0',
        contact: {
          name: 'Support Team',
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
        { name: 'Health', description: 'Endpoints to check API and database connectivity' },
        { name: 'Authentication', description: 'Endpoints related to user authentication' },
        { name: 'Player', description: 'Endpoints for player creation and management' },
        { name: 'Ranking', description: 'Endpoints for fetching player rankings' },
        { name: 'Monster', description: 'Endpoints for executing monster hunts' }
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
        description: 'Find more info here'
      }
    }
  })

  app.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  app.addHook('onReady', async () => {
    await connect();
    app.log.info('Database connected via onReady hook');
  });

  app.setErrorHandler(errorHandler);

  app.register(require('./plugins/auth').default);
  app.register(routes);

  return app;
}

export default buildServer();

process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});
