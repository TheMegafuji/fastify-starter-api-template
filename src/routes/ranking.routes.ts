import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { rankingController } from '../controllers/ranking.controller';
import { rankingRoutesDocSchema } from '../docs/ranking.doc';

export default async function rankingRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.get('/ranking', { schema: rankingRoutesDocSchema }, rankingController);
}
