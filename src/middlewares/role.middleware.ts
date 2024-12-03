import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGES } from '../constants';
import { UserRepository } from '../repositories';
import { IUser } from '../types';

export async function verifyRole(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string;
  const user = await UserRepository.getUserById(userId) as IUser;

  if (user.role !== 'admin') {
    return res.status(403).json({
      data: null, error: { message: ERROR_MESSAGES[403].FORBIDDEN },
    });
  }

  return next();
}
