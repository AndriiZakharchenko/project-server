import { MikroORM } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { logger } from './logger.helper';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

export const healthCheck = (orm: MikroORM) => {
  return async (req: Request, res: Response): Promise<Response> => {
    try {
      const connection = orm.em.getConnection();
      await connection.execute('SELECT 1');
      logger.info('Healthy');
      return res.status(200).json({ message: SUCCESS_MESSAGES[200].HEALTH_CHECK });
    } catch (error) {
      logger.error('Health check failed:', error);
      return res.status(500).json({ message: ERROR_MESSAGES[500].HEALTH_CHECK_FAILED, error });
    }
  };
};
