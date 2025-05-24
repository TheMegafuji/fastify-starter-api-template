import { CacheService } from '../services/cache.service';
import { connect as connectDB, disconnect as disconnectDB } from './db.config';

export let cacheService: CacheService;

export async function initializeConnections() {
  cacheService = new CacheService();
  await cacheService.connect();

  await connectDB();
}

export async function disconnectConnections() {
  if (cacheService) {
    await cacheService.disconnect();
  }

  await disconnectDB();
}