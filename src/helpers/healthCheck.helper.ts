import { MikroORM } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { logger } from './logger.helper';

export const healthCheck = (orm: MikroORM) => {
  return async (req: Request, res: Response): Promise<Response> => {
    try {
      const connection = orm.em.getConnection();
      await connection.execute('SELECT 1');
      logger.info('Healthy');
      return res.status(200).json({ message: 'Healthy' });
    } catch (error) {
      logger.error('Health check failed:', error);
      return res.status(500).json({ message: 'Unhealthy', error });
    }
  };
};
