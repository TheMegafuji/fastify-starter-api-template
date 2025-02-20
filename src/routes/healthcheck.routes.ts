import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { healthcheckController } from '../controllers/healthcheck.controller';
import { healthcheckDocSchema } from '../docs/healthcheck.doc';

export default async function healthcheckRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.get('/healthcheck', { schema: healthcheckDocSchema }, healthcheckController);
}
