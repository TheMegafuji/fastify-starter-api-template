import { Type } from '@sinclair/typebox';

export const CreatePlayerBodySchema = Type.Object({
    discordId: Type.String({ description: 'ID do Discord do jogador', example: 'discord-id' }),
    name: Type.String({ description: 'Nome do jogador', example: 'Player 1' }),
    email: Type.String({ format: 'email', description: 'Email do jogador', example: 'player@example.com' }),
    password: Type.String({ minLength: 6, description: 'Senha do jogador', example: 'senha123' }),
});

export const GetPlayerParamsSchema = Type.Object({
    id: Type.String({ 
        description: 'ID do jogador', 
        example: '1',
        pattern: '^[0-9]+$'
    }),
});

export const PlayerResponseSchema = Type.Object({
    id: Type.Number({ example: 1 }),
    discordId: Type.String({ example: 'discord-id' }),
    name: Type.String({ example: 'Player 1' }),
    exp: Type.Number({ example: 0 }),
    gold: Type.Number({ example: 0 }),
    email: Type.String({ format: 'email', example: 'player@example.com' }),
    level: Type.Number({ example: 1 }),
});

export const ErrorResponseSchema = Type.Object({
    message: Type.String({ example: 'Error message' })
});
