import './bootstrap-alias';
import os from 'os';
import app from './app';
import { connectDb } from './config/database.config';
import { loadEnv } from './config/env';
import logger from './common/lib/logger';

const startServer = async (): Promise<void> => {
  try {
    const env = loadEnv();

    await connectDb();

    app.listen(env.PORT, () => {
      logger.info('Server started', {
        url: env.URL,
        port: env.PORT,
        node: process.version,
        platform: os.platform(),
        arch: os.arch(),
        memory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
        cpus: os.cpus().length,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
  process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

startServer();
