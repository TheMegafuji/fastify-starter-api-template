import { FastifyRequest, FastifyReply } from 'fastify';
import { createPlayer, getPlayerById } from '../services/player.service';
import { cacheService } from '../config/redis.config';

export async function createPlayerController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const playerData = request.body;
        const player = await createPlayer(playerData);

        const cacheKey = `player:${player.id}`;
        await cacheService.set(cacheKey, player, 300);

        reply.status(201).send(player);
    } catch (error) {
        request.log.error(error);
        reply.status(500).send({ message: 'Failed to create player' });
    }
}

export async function getPlayerController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const playerId = parseInt(id, 10);
        
        if (isNaN(playerId)) {
            return reply.status(400).send({ message: 'Invalid player ID' });
        }
        
        const cacheKey = `player:${playerId}`;

        const cachedPlayer = await cacheService.get(cacheKey);
        if (cachedPlayer) {
            request.log.info(`Player ${playerId} found in cache`);
            return reply.send(cachedPlayer);
        }

        const player = await getPlayerById(playerId);
        if (!player) {
            return reply.status(404).send({ message: 'Player not found' });
        }
        
        await cacheService.set(cacheKey, player, 300);
        reply.send(player);
    } catch (error) {
        request.log.error(error);
        reply.status(500).send({ message: 'Failed to get player' });
    }
}
