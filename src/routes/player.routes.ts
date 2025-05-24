import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createPlayerController, getPlayerController } from '../controllers/player.controller';
import { playerRoutesDocSchema, getPlayerDocSchema } from '../docs/player.doc';

export default async function playerRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.post('/', { schema: playerRoutesDocSchema }, createPlayerController);
    fastify.get('/:id', { schema: getPlayerDocSchema }, getPlayerController);
}
