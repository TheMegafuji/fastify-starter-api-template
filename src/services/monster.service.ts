import { PlayerRepository } from '../repositories/player.repository';

export async function huntMonster(playerId: number) {
    const player = await PlayerRepository.findOne({ where: { id: playerId } });
    if (!player) {
        throw new Error('Player not found');
    }

    const level = player.level;

    const xpGain = Math.floor(Math.random() * (level * 10 - level * 5 + 1)) + level * 5;
    const goldGain = Math.floor(Math.random() * (level * 5 - level * 1 + 1)) + level * 1;

    player.exp += xpGain;
    player.gold += goldGain;

    const updatedPlayer = await PlayerRepository.save(player);

    return {
        xpGain,
        goldGain,
        newExp: updatedPlayer.exp,
        newGold: updatedPlayer.gold,
        newLevel: updatedPlayer.level,
    };
}
