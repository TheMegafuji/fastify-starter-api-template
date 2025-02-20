import { FastifyRequest, FastifyReply } from 'fastify';
import { getRanking } from '../services/ranking.service';

export async function rankingController(request: FastifyRequest, reply: FastifyReply) {
    const { page, perPage, sortBy, order, filter } = request.query as {
        page?: number;
        perPage?: number;
        sortBy?: 'exp' | 'gold' | 'level' | 'name';
        order?: 'ASC' | 'DESC';
        filter?: string;
    };

    try {
        const ranking = await getRanking({
            page,
            perPage,
            sortBy,
            order,
            filter,
        });
        reply.status(200).send(ranking);
    } catch (error) {
        request.log.error(error);
        reply.status(500).send({ message: 'Erro ao obter ranking' });
    }
}
