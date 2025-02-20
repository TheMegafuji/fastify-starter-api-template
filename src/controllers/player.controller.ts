import { FastifyRequest, FastifyReply } from 'fastify';
import { createPlayer } from '../services/player.service';

export async function createPlayerController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const playerData = request.body;
        const player = await createPlayer(playerData);
        reply.status(201).send(player);
    } catch (error) {
        request.log.error(error);
        reply.status(500).send({ message: 'Failed to create player' });
    }
}
