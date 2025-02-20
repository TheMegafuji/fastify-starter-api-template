import app from './server';
import dotenv from 'dotenv';
import { connect } from './config/db.config';
import pino from 'pino';

dotenv.config();

const logger = pino();

async function startServer() {
    try {
        // Let the server handle the database connection through its onReady hook
        const port = Number(process.env.PORT) || 3000;
        
        await app.listen({ port }, (err: Error) => {
            if (err) {
                logger.error('Error starting server:', err.message);
                process.exit(1);
            }
            logger.info(`Server is running locally on port ${port}`);
        });
    } catch (error) {
        logger.error('Error starting application:', error);
        process.exit(1);
    }
}

startServer();
