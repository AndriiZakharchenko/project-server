import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../constants';
import UserModel from '../models/user.model';

export async function validateUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'];
  const isUserExist = await UserModel.findOne({ id: userId });

  if (!userId) {
    return res.status(401).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].UNAUTHORIZED },
    });
  }

  if (!isUserExist) {
    return res.status(404).json({
      data: null,
      error: { message: ERROR_MESSAGES[404].NOT_FOUND },
    });
  }

  return next();
}
