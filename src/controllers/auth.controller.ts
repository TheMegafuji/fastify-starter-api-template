import { FastifyRequest, FastifyReply } from 'fastify';
import { PlayerRepository } from '../repositories/player.repository';
import bcrypt from 'bcrypt';

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as { email: string; password: string };

    try {
        const player = await PlayerRepository.createQueryBuilder('player')
            .addSelect('player.password')
            .where('player.email = :email', { email })
            .getOne();

        if (!player) {
            return reply.status(401).send({ message: 'Email ou senha inválidos' });
        }

        const isValid = await bcrypt.compare(password, player.password);
        if (!isValid) {
            return reply.status(401).send({ message: 'Email ou senha inválidos' });
        }

        const token = await reply.jwtSign(
            { userId: player.id, email: player.email },
            { expiresIn: '12h' }
        );

        return reply.send({ token });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ message: 'Erro interno no servidor' });
    }
}
