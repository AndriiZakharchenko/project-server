import { NextFunction, Response } from 'express';
import { ERROR_MESSAGES } from '../constants';
import { ICustomRequest } from '../types';
import { ACCESS_MAP } from './accessRoutes';

export async function authorizeRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const path = req.path as keyof typeof ACCESS_MAP;

  if (!(ACCESS_MAP[path].includes(req.user!.role))) {
    return res.status(403).json({
      data: null, error: { message: ERROR_MESSAGES[403].FORBIDDEN },
    });
  }

  return next();
}
