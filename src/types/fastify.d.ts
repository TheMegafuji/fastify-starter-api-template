import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        jwt: {
            sign: (payload: { userId: number; email: string }) => string;
            verify: (token: string) => { userId: number; email: string };
        };
    }

    interface FastifyRequest {
        user: {
            userId: number;
            email: string;
        } | undefined;
    }
}
export { };