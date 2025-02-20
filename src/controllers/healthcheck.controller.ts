import { FastifyRequest, FastifyReply } from 'fastify';
import { connectionSource } from '../config/db.config';

export async function healthcheckController(request: FastifyRequest, reply: FastifyReply) {
    try {
        await connectionSource.query('SELECT 1');
        reply.status(200).send({ message: 'API is up and running' });
    } catch (error) {
        reply.status(500).send({ message: 'API is down' });
    }
}