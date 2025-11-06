import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants';
import { logger, setRefreshTokenCookie } from '../helpers';
import { ICustomRequest, UserDTOType } from '../types';

export async function authenticateRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const bearerToken = req.headers?.authorization?.split(' ')[1];

  if (!bearerToken) {
    return res.status(401).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].TOKEN_REQUIRED },
    });
  }

  try {
    // Validate token
    const {
      id, email, role, is_activated,
    } = jwt.verify(bearerToken, process.env.ACCESS_TOKEN!) as UserDTOType;

    if (!id) {
      return res.status(403).json({
        data: null,
        error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
      });
    }
    // Set user info to request object
    req.user = {
      id, email, role, is_activated,
    };
  } catch (error) {
    logger.error(error);
    res.clearCookie('refreshToken');

    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  return next();
}
