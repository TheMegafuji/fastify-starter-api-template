import { Type } from '@sinclair/typebox';

export const RankingQuerySchema = Type.Object({
    page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
    perPage: Type.Optional(Type.Number({ default: 10, minimum: 1 })),
    sortBy: Type.Optional(
        Type.Union([
            Type.Literal('exp'),
            Type.Literal('gold'),
            Type.Literal('level'),
            Type.Literal('name')
        ], { default: 'exp' })
    ),
    order: Type.Optional(
        Type.Union([
            Type.Literal('ASC'),
            Type.Literal('DESC')
        ], { default: 'DESC' })
    ),
    filter: Type.Optional(Type.String()),
});

export const RankingResponseSchema = Type.Object({
    page: Type.Number({ example: 1 }),
    perPage: Type.Number({ example: 10 }),
    total: Type.Number({ example: 20 }),
    data: Type.Array(
        Type.Object({
            id: Type.Number({ example: 1 }),
            name: Type.String({ example: 'Player 1' }),
            exp: Type.Number({ example: 100 }),
            gold: Type.Number({ example: 50 }),
            level: Type.Number({ example: 2 }),
            discordId: Type.String({ example: 'discord-1' }),
            email: Type.String({ format: 'email', example: 'player1@example.com' }),
        })
    ),
});
