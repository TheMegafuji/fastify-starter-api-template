import { Type } from '@sinclair/typebox';

export const MonsterResponseSchema = Type.Object({
    xpGain: Type.Number({ description: 'XP ganho', example: 20 }),
    goldGain: Type.Number({ description: 'Ouro ganho', example: 10 }),
    newExp: Type.Number({ description: 'Novo total de XP', example: 120 }),
    newGold: Type.Number({ description: 'Novo total de ouro', example: 10 }),
    newLevel: Type.Number({ description: 'Novo nível', example: 2 }),
});
