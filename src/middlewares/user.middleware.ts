import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants';
import { logger } from '../helpers';
import { UserRepository } from '../repositories';
import { IUser } from '../types';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/auth') || req.path.startsWith('/health')) {
    return next();
  }

  const userId = req.headers['x-user-id'] as string;
  const user = await UserRepository.getUserById(userId) as IUser;
  if (!user || JSON.stringify(user) === '[]') {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[404].USER_NOT_FOUND },
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].TOKEN_REQUIRED },
    });
  }

  const [tokenType, token] = authHeader.split(' ');
  if (tokenType !== 'Bearer') {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN!);
  } catch (error) {
    logger.error(error);
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  return next();
}
