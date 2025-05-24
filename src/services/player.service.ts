import { PlayerRepository } from '../repositories/player.repository';
import { PlayerEntity } from '../entities/Player';
import bcrypt from 'bcrypt';

export async function createPlayer(playerData: Partial<PlayerEntity>): Promise<Partial<PlayerEntity>> {
    if (playerData.password) {
        const saltRounds = 10;
        playerData.password = await bcrypt.hash(playerData.password, saltRounds);
    }
    playerData.gold = 0;
    playerData.exp = 0;

    const player = PlayerRepository.create(playerData);
    const savedPlayer = await PlayerRepository.save(player);
    
    const { password, ...playerWithoutPassword } = savedPlayer;
    return playerWithoutPassword;
}

export async function getPlayerById(id: number): Promise<Partial<PlayerEntity> | null> {
    const player = await PlayerRepository.findOne({ where: { id } });
    
    if (!player) {
        return null;
    }
    
    const { password, ...playerWithoutPassword } = player;
    return playerWithoutPassword;
}
