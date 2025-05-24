import { createClient, RedisClientType } from 'redis';
import { Redis } from '@upstash/redis';
import logger from '../config/logger';

type RedisClient = Redis | RedisClientType;

export class CacheService {
  private client: RedisClient;
  private isUpstash: boolean;

  constructor(redisUrl?: string) {
    const isLocalEnvironment =
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'local' ||
      process.env.NODE_ENV === 'test';

    this.isUpstash = isLocalEnvironment;

    if (this.isUpstash) {
      this.client = new Redis({
        url: redisUrl || process.env.UPSTASH_REDIS_REST_URL || '',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      });
      logger.info('Upstash Redis client initialized for local environment');
    } else {
      const defaultUrl =
        process.env.REDIS_URL && process.env.REDIS_URL.startsWith('redis://')
          ? process.env.REDIS_URL
          : `redis://${process.env.REDIS_URL || 'localhost:6379'}`;

      this.client = createClient({
        url: redisUrl || defaultUrl,
        socket: {
          tls: true,
          reconnectStrategy: retries => {
            const delay = Math.min(retries * 50, 2000);
            return delay;
          },
        },
      }) as RedisClientType;

      (this.client as RedisClientType).on('error', err => {
        logger.error({ err }, 'Redis connection error');
      });

      (this.client as RedisClientType).on('connect', () => {
        logger.info('Successfully connected to Redis');
      });

      logger.info('Traditional Redis client initialized for production');
    }
  }

  async connect(): Promise<void> {
    try {
      if (!this.isUpstash) {
        await (this.client as RedisClientType).connect();
      }
      logger.info('Successfully connected to cache service');
    } catch (err) {
      logger.error({ err }, 'Failed to connect to cache service');
      throw err;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = this.isUpstash ? value : JSON.stringify(value);

      if (ttl) {
        if (this.isUpstash) {
          await (this.client as Redis).setex(key, ttl, serializedValue);
        } else {
          await (this.client as RedisClientType).setEx(
            key,
            ttl,
            serializedValue
          );
        }
      } else {
        await (this.client as RedisClientType).set(key, serializedValue);
      }
    } catch (error) {
      logger.error({ error, key }, 'Error setting cache');
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await (this.client as RedisClientType).get(key);
      if (!value) return null;

      if (this.isUpstash) {
        return value as T;
      } else {
        return JSON.parse(value as string) as T;
      }
    } catch (error) {
      logger.error({ error, key }, 'Error getting cache');
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error({ error, key }, 'Error deleting cache');
      throw error;
    }
  }

  async flush(): Promise<void> {
    try {
      if (this.isUpstash) {
        await (this.client as Redis).flushall();
      } else {
        await (this.client as RedisClientType).flushAll();
      }
    } catch (error) {
      logger.error({ error }, 'Error flushing cache');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (!this.isUpstash && (this.client as RedisClientType).isOpen) {
        await (this.client as RedisClientType).disconnect();
        logger.info('Successfully disconnected from Redis');
      } else if (this.isUpstash) {
        logger.info('Upstash Redis client disconnected (no-op)');
      }
    } catch (err) {
      logger.error({ err }, 'Failed to disconnect from cache service');
      throw err;
    }
  }
} 