import { connectionSource } from '../config/db.config';
import { PlayerEntity } from '../entities/Player';

export const PlayerRepository = connectionSource.getRepository(PlayerEntity);