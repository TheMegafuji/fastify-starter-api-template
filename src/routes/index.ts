import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import healthcheckRoutes from './healthcheck.routes';
import playerRoutes from './player.routes';
import rankingRoutes from './ranking.routes';
import monsterRoutes from './monster.routes';
import authRoutes from './auth.routes';

export default async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.register(healthcheckRoutes);
  fastify.register(playerRoutes, { prefix: '/player' });
  fastify.register(rankingRoutes);
  fastify.register(monsterRoutes);
  fastify.register(authRoutes);
}