import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import pino from 'pino';

const logger = pino();

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    logger.error(`Error occurred: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);

    reply.status(500).send({
        message: 'An internal server error occurred',
        error: error.message,
    });
}
