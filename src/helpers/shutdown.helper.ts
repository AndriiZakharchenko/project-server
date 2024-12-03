import { MikroORM } from '@mikro-orm/core';
import { Server } from 'http';
import { logger } from './logger.helper';

export const shutdown = async (server: Server, orm: MikroORM): Promise<void> => {
  logger.info('Gracefully shutting down...');

  // Close the HTTP server
  server.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    // Close the database connection
    await orm.close();
    logger.info('Database connection closed');
  } catch (err) {
    logger.error('Error during database disconnection:', err);
  } finally {
    process.exit(0);
  }
};
