import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { ERROR_MESSAGES } from '../constants';
import { Users } from '../entities';

export async function validateUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].UNAUTHORIZED },
    });
  }

  const em = RequestContext.getEntityManager();
  const isUserExist = await em!.findOne(Users, { id: userId });

  if (!isUserExist) {
    return res.status(404).json({
      data: null,
      error: { message: ERROR_MESSAGES[404].USER_NOT_FOUND },
    });
  }

  return next();
}
