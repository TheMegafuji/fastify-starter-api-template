import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import pino from 'pino';

const MAX_RETRIES = 5;
const isTestEnv = process.env.NODE_ENV === 'development';

const logger = pino();

const baseDbConfig: Partial<DataSourceOptions> = {
  type: 'postgres',
  entities: [__dirname + '/../entities/*.{js,ts}'],
  synchronize: isTestEnv ? true : false,
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  logging: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  extra: {
    max: Number(process.env.DB_MAX_CONNECTION) || 10,
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 60000,
    keepAlive: true,
  },
};

let connectionOptions: DataSourceOptions;

if (process.env.DATABASE_URL) {
  const matches = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (!matches) {
    throw new Error('Invalid DATABASE_URL format');
  }

  const [, username, password, host, port, database] = matches;

  connectionOptions = {
    ...baseDbConfig,
    host,
    port: parseInt(port),
    username,
    password,
    database,
  } as DataSourceOptions;
} else {
  connectionOptions = {
    ...baseDbConfig,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
  } as DataSourceOptions;
}

export const connectionSource = new DataSource(connectionOptions);


export async function connect(retries = MAX_RETRIES): Promise<void> {
    try {
        if (!connectionSource.isInitialized) {
            await connectionSource.initialize();
            logger.info('Database connection established');
        }
    } catch (error) {
        logger.error('Error connecting to the database:', {
            error: error instanceof Error ? error.message : String(error),
            database: connectionOptions.database
        });

        if (retries > 0) {
            logger.info(`Retrying connection in 5 seconds... (Attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
            await new Promise((res) => setTimeout(res, 5000));
            return connect(retries - 1);
        }
        
        logger.fatal('Maximum retry attempts reached. Unable to establish database connection.');
        throw error;
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
