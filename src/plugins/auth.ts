import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { VerifyOptions } from '@fastify/jwt';
import fp from 'fastify-plugin';

async function authPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET || 'supersecret-ultrapassword-1234567890'
    });

    fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.status(401).send({ message: 'Token inválido ou ausente' });
        }
    });
}

export default fp(authPlugin);
