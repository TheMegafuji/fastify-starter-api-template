import 'fastify';
import '@fastify/jwt';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { userId: number; email: string };
        user: { userId: number; email: string };
    }
}

export { }; 