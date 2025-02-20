import { PlayerEntity } from '../entities/Player';
import { PlayerRepository } from '../repositories/player.repository';
import { SelectQueryBuilder } from 'typeorm';

interface RankingQuery {
    page?: number;
    perPage?: number;
    sortBy?: 'exp' | 'gold' | 'level' | 'name';
    order?: 'ASC' | 'DESC';
    filter?: string;
}

export async function getRanking(query: RankingQuery) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const perPage = query.perPage && query.perPage > 0 ? query.perPage : 10;
    const sortBy = query.sortBy || 'exp';
    const order = query.order || 'DESC';

    let qb: SelectQueryBuilder<PlayerEntity> = PlayerRepository.createQueryBuilder('player');

    if (query.filter) {
        qb = qb.where('player.name ILIKE :filter', { filter: `%${query.filter}%` });
    }

    if (sortBy === 'level') {
        qb = qb.orderBy('player.exp', order);
    } else {
        qb = qb.orderBy(`player.${sortBy}`, order);
    }

    qb = qb.skip((page - 1) * perPage).take(perPage);

    const [data, total] = await qb.getManyAndCount();

    const players = data.map(player => ({
        id: player.id,
        name: player.name,
        exp: player.exp,
        gold: player.gold,
        level: player.level,
        discordId: player.discordId,
        email: player.email,
    }));

    return {
        page,
        perPage,
        total,
        data: players,
    };
}
