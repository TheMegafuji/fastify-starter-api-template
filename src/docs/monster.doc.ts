import { MonsterResponseSchema } from "../schemas/monster.schema";

export const monsterRoutesDocSchema = {
    description: 'Executa uma caçada de monstro para um jogador autenticado',
    tags: ['Monster'],
    security: [{ bearerAuth: [] }],
    response: {
        200: MonsterResponseSchema,
        401: { type: 'object', properties: { message: { type: 'string' } } },
        500: { type: 'object', properties: { message: { type: 'string' } } },
    }
}