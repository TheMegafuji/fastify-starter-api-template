import '@fastify/jwt';
import { buildServer } from '../src/server';
import supertest from 'supertest';
import { PlayerRepository } from '../src/repositories/player.repository';
import bcrypt from 'bcrypt';

jest.setTimeout(15000);
const fastify = buildServer();
let token: string;

beforeAll(async () => {
    await fastify.ready();
    await PlayerRepository.delete({ discordId: `discord-test` });

    const hashedPassword = await bcrypt.hash('testplayer', 10);
    const player = PlayerRepository.create({
        discordId: 'discord-test',
        name: 'Test Player',
        exp: 0,
        gold: 0,
        email: 'testplayer@test.com',
        password: hashedPassword
    });
    await PlayerRepository.save(player);

    token = fastify.jwt.sign(
        { userId: player.id, email: player.email },
        { expiresIn: '1h' }
    );
});

afterAll(async () => {
    await fastify.close();
});

describe('POST /monster-hunt', () => {
    it('deve permitir que um jogador autenticado cace monstro', async () => {
        const response = await supertest(fastify.server)
            .post('/monster-hunt')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('xpGain');
        expect(response.body).toHaveProperty('goldGain');
        expect(response.body).toHaveProperty('newExp');
        expect(response.body).toHaveProperty('newGold');
        expect(response.body).toHaveProperty('newLevel');
    });

    it('deve rejeitar requisições não autenticadas', async () => {
        const response = await supertest(fastify.server).post('/monster-hunt');
        expect(response.status).toBe(401);
    });
});
