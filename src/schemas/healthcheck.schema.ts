import { Type } from '@sinclair/typebox';

export const HealthcheckResponseSchema = Type.Object({
    message: Type.String({ description: 'Status da API', example: 'API is up and running' }),
});
