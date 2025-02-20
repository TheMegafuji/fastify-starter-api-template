import { Type } from '@sinclair/typebox';

export const LoginBodySchema = Type.Object({
    email: Type.String({ format: 'email', description: 'Email do usuário', example: 'user@example.com' }),
    password: Type.String({ minLength: 6, description: 'Senha do usuário', example: '123456' }),
});

export const LoginResponseSchema = Type.Object({
    token: Type.String({ description: 'Token JWT gerado', example: 'jwt_token_here' }),
});
