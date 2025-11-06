import { NextFunction, Response } from 'express';
import { ERROR_MESSAGES } from '../constants';
import { ICustomRequest } from '../types';
import { ACCESS_MAP, HttpMethod } from './accessRoutes';

export async function authorizeRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const path = req.path as keyof typeof ACCESS_MAP;
  const method = req.method as HttpMethod;
  const userRole = req.user?.role;

  // Check if user role is present
  if (!userRole) {
    return res.status(401).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].ROLE_NOT_FOUND },
    });
  }
  // Check if the path exists in the ACCESS_MAP
  if (!ACCESS_MAP[path]) {
    return res.status(404).json({
      data: null,
      error: { message: ERROR_MESSAGES[404].ROUTE_NOT_FOUND },
    });
  }

  // Check if the method is allowed for the given path
  if (!ACCESS_MAP[path][method]) {
    return res.status(405).json({
      data: null,
      error: { message: ERROR_MESSAGES[405].METHOD_NOT_ALLOWED },
    });
  }

  const allowedRoles = ACCESS_MAP[path][method];
  // User has universal access 777
  if (allowedRoles.includes('*')) {
    return next();
  }

  // User role is not allowed for this route
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].FORBIDDEN },
    });
  }

  return next();
}
