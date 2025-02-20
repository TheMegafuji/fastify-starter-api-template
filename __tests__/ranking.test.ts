import { buildServer } from '../src/server';
import supertest from 'supertest';
import { PlayerRepository } from '../src/repositories/player.repository';
import { PlayerEntity } from '../src/entities/Player';
import bcrypt from 'bcrypt';

jest.setTimeout(15000);

const fastify = buildServer();

beforeAll(async () => {
    await fastify.ready();
    await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
            PlayerRepository.delete({ discordId: `discord-${i + 1}` })
        )
    );

    const players: PlayerEntity[] = [];
    for (let i = 1; i <= 20; i++) {
        const hashedPassword = await bcrypt.hash('testplayer', 10);
        const player = PlayerRepository.create({
            discordId: `discord-${i}`,
            name: `Player ${i}`,
            exp: 0,
            gold: 0,
            email: `player${i}@test.com`,
            password: hashedPassword
        });
        players.push(player);
    }
    await PlayerRepository.save(players);
});

afterAll(async () => {
    await fastify.close();
});

describe('GET /ranking', () => {
    it('deve retornar o ranking com paginação padrão', async () => {
        const response = await supertest(fastify.server).get('/ranking');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toBeLessThanOrEqual(10);
    });

    it('deve retornar ranking com paginação, filtro e ordenação especificados', async () => {
        const response = await supertest(fastify.server)
            .get('/ranking')
            .query({ page: 2, perPage: 5, sortBy: 'exp', order: 'ASC', filter: 'Player' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toBeLessThanOrEqual(5);
    });
});
