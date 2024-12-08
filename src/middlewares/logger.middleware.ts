import { Request, Response, NextFunction } from 'express';
import { loggerRequests } from '../helpers';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('error', (err) => {
    loggerRequests.error(err.message);
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = `${req.method} ${req.originalUrl} - ${duration}ms`;

    loggerRequests.info(logMessage);
  });

  next();
};
