import { Type } from "@sinclair/typebox";
import { RankingQuerySchema, RankingResponseSchema } from "../schemas/ranking.schema";

export const rankingRoutesDocSchema = {
    description: 'Retorna ranking de jogadores com paginação, filtro e ordenação',
    tags: ['Ranking'],
    querystring: RankingQuerySchema,
    response: {
        200: RankingResponseSchema,
        500: Type.Object({ message: Type.String() }),
    }
}
