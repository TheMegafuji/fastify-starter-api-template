import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import pino from 'pino';

const MAX_RETRIES = 5;
const isTestEnv = process.env.NODE_ENV === 'test';

const logger = pino();

const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  entities: [__dirname + '/../entities/*.{js,ts}'],
  synchronize: isTestEnv ? true : false,
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  logging: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  extra: {
    max: 10,
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 60000,
    keepAlive: true,
  },
};

export const connectionSource = new DataSource(connectionOptions);


export async function connect(retries = MAX_RETRIES) {
    try {
        if (!connectionSource.isInitialized) {
            await connectionSource.initialize();
            logger.debug('Database connection established');
        }
    } catch (error) {
        logger.error('Cannot connect to database');
        logger.error(error);

        if (retries > 0) {
            logger.info(`Retrying... (${MAX_RETRIES - retries + 1})`);
            await new Promise((res) => setTimeout(res, 5000));
            return connect(retries - 1);
        } else {
            return error;
        }
    }
}

export async function disconnect() {
    try {
        await connectionSource.destroy();
        logger.debug('Database connection closed');
    } catch (error) {
        logger.error('Error closing database connection:', error);
    }
}

process.on('SIGINT', async () => {
    await disconnect();
    process.exit(0);
});
