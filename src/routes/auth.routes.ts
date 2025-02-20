import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { loginController } from '../controllers/auth.controller';
import { loginDocSchema } from '../docs/auth.doc';

export default async function authRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.post('/auth/login', { schema: loginDocSchema }, loginController);
}
