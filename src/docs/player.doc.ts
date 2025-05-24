import { CreatePlayerBodySchema, PlayerResponseSchema, GetPlayerParamsSchema, ErrorResponseSchema } from "../schemas/player.schema";

export const playerRoutesDocSchema = {
    description: 'Cria um novo jogador',
    tags: ['Player'],
    body: CreatePlayerBodySchema,
    response: {
        201: PlayerResponseSchema,
        500: ErrorResponseSchema,
    }
}

export const getPlayerDocSchema = {
    description: 'Busca um jogador por ID',
    tags: ['Player'],
    params: GetPlayerParamsSchema,
    response: {
        200: PlayerResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
    }
}
