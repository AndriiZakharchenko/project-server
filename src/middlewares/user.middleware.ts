import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../constants';
import { cart } from '../data/cart';

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'];
  const isUserExist = cart.find((item) => item.userId === userId);

  if (!userId) {
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].FORBIDDEN },
    });
  }

  if (!isUserExist) {
    return res.status(401).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].UNAUTHORIZED },
    });
  }

  next();
}
