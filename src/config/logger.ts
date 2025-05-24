import pino from 'pino';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const loggerOptions: pino.LoggerOptions = {
  level: isProduction ? 'info' : 'debug',

  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : {}),

  base: {
    app: process.env.APP_NAME || 'api',
    env: process.env.NODE_ENV || 'development',
  },

  serializers: {
    err: pino.stdSerializers.err,
    error: (error: any) => {
      if (!error) return error;

      return {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail,
        name: error.name,
      };
    },
  },
};

const logger = pino(loggerOptions);

export default logger;
