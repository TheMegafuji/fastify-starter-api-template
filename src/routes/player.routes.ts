import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createPlayerController } from '../controllers/player.controller';
import { playerRoutesDocSchema } from '../docs/player.doc';

export default async function playerRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.post('/', { schema: playerRoutesDocSchema }, createPlayerController);
}
