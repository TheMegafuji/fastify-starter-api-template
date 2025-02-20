import { LoginResponseSchema, LoginBodySchema } from "../schemas/auth.schema";
import { Type } from "@sinclair/typebox";

export const loginDocSchema = {
    description: 'Realiza login e retorna token JWT',
    tags: ['Authentication'],
    body: LoginBodySchema,
    response: {
        200: LoginResponseSchema,
        400: Type.Object({ errors: Type.Any() }),
        401: Type.Object({ message: Type.String() }),
        500: Type.Object({ message: Type.String() }),
    },
    security: [{ bearerAuth: [] }]
}