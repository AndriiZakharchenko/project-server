import { NextFunction, Response } from 'express';
import { ERROR_MESSAGES } from '../constants';
import { ICustomRequest } from '../types';
import { ACCESS_MAP, HttpMethod } from './accessRoutes';

export async function authorizeRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const path = req.path as keyof typeof ACCESS_MAP;
  const method = req.method as HttpMethod;

  if (!ACCESS_MAP[path]) {
    return res.status(404).json({
      data: null,
      error: { message: 'Route not found' },
    });
  }

  if (!ACCESS_MAP[path][method]) {
    return res.status(405).json({
      data: null,
      error: { message: 'Method not allowed' },
    });
  }

  const allowedRoles = ACCESS_MAP[path][method];
  const userRole = req.user!.role;

  if (allowedRoles.includes('*')) {
    return next();
  }

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].FORBIDDEN },
    });
  }

  return next();
}
