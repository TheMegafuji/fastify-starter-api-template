# Fastify Starter API Template

Uma base escalável e modular para o desenvolvimento de APIs backend utilizando **Fastify**, **TypeORM** e **PostgreSQL**. Ideal para kickstart de projetos robustos que necessitam de autenticação JWT, testes automatizados e integração com ferramentas modernas (Docker, Vercel, Redis e AWS).

## Sumário
- [Fastify Starter API Template](#fastify-starter-api-template)
  - [Sumário](#sumário)
  - [Recursos](#recursos)
  - [Tecnologias](#tecnologias)
  - [Arquitetura](#arquitetura)
- [Configuração para deploy na Vercel](#configuração-para-deploy-na-vercel)
  - [Instalação](#instalação)
- [Configuração:](#configuração)
  - [Execução](#execução)
    - [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
    - [Ambiente de Produção](#ambiente-de-produção)
  - [Testes](#testes)
  - [Documentação da API](#documentação-da-api)
  - [Deploy](#deploy)
    - [Docker](#docker)
    - [Vercel](#vercel)
  - [Licença](#licença)

## Recursos

- **Servidor e API com Fastify:** Gerenciamento eficiente de requisições HTTP e definição de rotas.
- **Banco de Dados com PostgreSQL e TypeORM:** Operações CRUD e migrações com configuração robusta.
- **Autenticação JWT:** Segurança para endpoints protegidos.
- **Sistema de Ranking:** Listagem paginada, filtrada e ordenada dos jogadores.
- **Endpoints de Gameplay:** Caça ao monstro com lógica de progressão (XP, ouro e níveis).
- **Middleware Personalizado:** Autenticação e tratamento centralizado de erros.
- **Testes Automatizados:** Cobertura de endpoints críticos com Jest e supertest.
- **Integração com Redis e AWS:** Configurações para caching e serviços em nuvem.
- **Deploy Pronto para Docker e Vercel:** Facilita o escalonamento e a implantação em ambientes serverless.

## Tecnologias

- **[Fastify](https://www.fastify.io/)** – Framework web de alta performance.
- **[TypeORM](https://typeorm.io/)** – ORM para TypeScript e JavaScript.
- **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional.
- **[JWT](https://jwt.io/)** – Autenticação via JSON Web Tokens.
- **[@sinclair/typebox](https://github.com/sinclairzx81/typebox)** – Definição e validação de schemas para Fastify. Utilizado para criar definições de tipos e realizar a validação automática dos dados de entrada e saída dos endpoints.
- **[Jest](https://jestjs.io/)** – Framework para testes.
- **[Docker](https://www.docker.com/)** – Containerização.
- **[Vercel](https://vercel.com/)** – Plataforma de deploy serverless.
- **[Redis](https://redis.io/)** – Armazenamento em cache e gerenciamento de sessões.

## Arquitetura

A estrutura do projeto segue uma abordagem modular, separando as responsabilidades em:

- **Controllers:** Lógica de processamento e respostas HTTP.
- **Services:** Regras de negócio e manipulação de dados.
- **Repositories:** Acesso ao banco de dados via TypeORM.
- **Routes:** Definição dos endpoints e integração com os controllers.
- **Schemas:** Validação de entrada e saída utilizando **@sinclair/typebox**. Essa abordagem permite que o Fastify valide automaticamente os dados das requisições, eliminando a necessidade de validação manual dentro dos controllers.
- **Plugins:** Configurações personalizadas (ex.: autenticação, tratamento de erros).
- **Config:** Arquivos de configuração para banco de dados, AWS, Redis, etc.
- **Tests:** Scripts para testes automatizados, garantindo a integridade dos endpoints.

A seguir, a estrutura de pastas do projeto:

```sh
├── __tests__/
    ├── monster.test.ts
    └── ranking.test.ts
├── src/
    ├── api/
    │   └── index.ts
    ├── config/
    │   ├── aws.config.ts
    │   ├── db.config.ts
    │   ├── index.ts
    │   └── redis.config.ts
    ├── controllers/
    │   ├── auth.controller.ts
    │   ├── healthcheck.controller.ts
    │   ├── monster.controller.ts
    │   ├── player.controller.ts
    │   └── ranking.controller.ts
    ├── docs/
    │   ├── auth.doc.ts
    │   ├── healthcheck.doc.ts
    │   ├── monster.doc.ts
    │   ├── player.doc.ts
    │   └── ranking.doc.ts
    ├── entities/
    │   └── Player.ts
    ├── migrations/
    ├── plugins/
    │   ├── auth.ts
    │   └── errorHandler.ts
    ├── repositories/
    │   └── player.repository.ts
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── healthcheck.routes.ts
    │   ├── index.ts
    │   ├── monster.routes.ts
    │   ├── player.routes.ts
    │   └── ranking.routes.ts
    ├── schemas/
    │   ├── auth.schema.ts
    │   ├── healthcheck.schema.ts
    │   ├── monster.schema.ts
    │   ├── player.schema.ts
    │   └── ranking.schema.ts
    ├── services/
    │   ├── monster.service.ts
    │   ├── player.service.ts
    │   └── ranking.service.ts
    ├── types/
    │   ├── fastify-jwt.d.ts
    │   └── fastify.d.ts
    ├── local.ts
    └── server.ts
├── .editorconfig
├── .prettierrc
├── debug.log
├── Dockerfile
├── errors.log
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vercel.json
```

# Configuração para deploy na Vercel

## Instalação

1. **Clone o repositório:**

   ```sh
   git clone <URL_DO_REPOSITORIO>
   cd fastify-starter-api-template
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

# Configuração:

```sh
# Configurações do Servidor
PORT = 5000
NODE_ENV = development|production|homolog

# Banco de Dados - Opção 1: URLs completas
DATABASE_URL_WRITE = postgres://user:password@host:port/database
DATABASE_URL_READ = postgres://user:password@host:port/database

# Banco de Dados - Opção 2: Variáveis individuais
DB_HOST = localhost
DB_PORT = 5432
DB_USER = root
DB_PASSWORD = your_password
DB_NAME = your_database
DB_SSL = true|false
DB_MAX_CONNECTION = 10

# Redis e Cache
REDIS_URL = redis://localhost:6379
UPSTASH_REDIS_REST_URL = 
UPSTASH_REDIS_REST_TOKEN = 

# AWS Services (Opcional)
AWS_REGION = 
AWS_ACCESS_KEY_ID = 
AWS_SECRET_ACCESS_KEY = 

# JWT & API Security
JWT_SECRET = your-super-secret-jwt-key-here-make-it-long-and-random
API_SECRET_KEY = your-api-secret-key-for-additional-security

# Rate Limiting
RATE_LIMIT_REDIS_URL = redis://localhost:6379

# Logging
LOG_LEVEL = info
APP_NAME = your_app_name

# CORS
CORS_ORIGIN = http://localhost:3000,https://yourdomain.com
```

## Execução

### Ambiente de Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento com hot-reloading:

```sh
npm run dev
```

### Ambiente de Produção

Para construir e iniciar o projeto utilizando Vercel:

```sh
npm run build
npm run start
```

## Testes

Os testes automatizados foram desenvolvidos com Jest e supertest. Para executá-los, use:

```sh
npm test
```
Os testes estão localizados na pasta __tests__/ e cobrem os endpoints de monster-hunt e ranking, garantindo o comportamento esperado.

## Documentação da API

A documentação interativa da API está disponível via Swagger:

Acesse: http://localhost:3000/documentation
Nesta interface, você pode visualizar todos os endpoints, modelos de dados, parâmetros e exemplos de resposta.

## Deploy

### Docker

O projeto inclui um Dockerfile para containerização. Para construir e rodar o container:

```sh
docker build -t fastify-starter-api-template .
docker run -p 3000:3000 fastify-starter-api-template
```

### Vercel

A configuração para deploy em Vercel está pronta no arquivo `vercel.json`. Basta conectar o repositório ao Vercel para que o deploy seja efetuado automaticamente.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).