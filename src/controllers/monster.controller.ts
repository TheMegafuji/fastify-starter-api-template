import { FastifyRequest, FastifyReply } from 'fastify';
import { huntMonster } from '../services/monster.service';

export async function monsterHuntController(request: FastifyRequest, reply: FastifyReply) {
    try {
        if (!request.user || !request.user.userId) {
            return reply.status(401).send({ message: 'Usuário não autenticado' });
        }
        const result = await huntMonster(request.user.userId);
        reply.status(200).send(result);
    } catch (error) {
        request.log.error(error);
        reply.status(500).send({ message: 'Erro ao caçar monstro' });
    }
}