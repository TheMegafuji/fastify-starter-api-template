import app from './server';
import dotenv from 'dotenv';
import { connectionSource } from './config/db.config';
import pino from 'pino';

dotenv.config();

const logger = pino();

async function startServer() {
    try {
        if (!connectionSource.isInitialized) {
            await connectionSource.initialize();
            logger.info('Database connection established');
        }

        const port = Number(process.env.PORT) || 3000;
        
        try {
            await app.listen({ port }, (err: Error) => {
                if (err) {
                    logger.error('Error starting server:', err.message);
                    process.exit(1);
                }
                logger.info(`Server is running locally on port ${port}`);
            });
        } catch (serverError) {
            logger.error('Error starting server:', serverError);
            process.exit(1);
        }

    } catch (dbError) {
        logger.error('Error connecting to the database:', dbError);
        process.exit(1);
    }
}

startServer();
