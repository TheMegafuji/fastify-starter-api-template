import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { monsterHuntController } from '../controllers/monster.controller';
import { monsterRoutesDocSchema } from '../docs/monster.doc';

export default async function monsterRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.post('/monster-hunt', { preHandler: fastify.authenticate, schema: monsterRoutesDocSchema }, monsterHuntController);
}
