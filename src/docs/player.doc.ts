import { CreatePlayerBodySchema, PlayerResponseSchema } from "../schemas/player.schema";
import { Type } from "@sinclair/typebox";

export const playerRoutesDocSchema = {
    description: 'Cria um novo jogador',
    tags: ['Player'],
    body: CreatePlayerBodySchema,
    response: {
        201: PlayerResponseSchema,
        500: Type.Object({ message: Type.String() }),
    }
}
