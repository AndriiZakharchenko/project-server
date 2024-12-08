import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants';
import { logger } from '../helpers';
import { ICustomRequest, IUser } from '../types';

export async function authenticateRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].TOKEN_REQUIRED },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!) as Omit<IUser, 'password'>;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch (error) {
    logger.error(error);
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  return next();
}
