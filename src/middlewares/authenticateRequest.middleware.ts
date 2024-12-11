import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants';
import { logger } from '../helpers';
import { ICustomRequest, IUser } from '../types';

export async function authenticateRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
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
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY!) as Omit<IUser, 'password'>;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.PRIVATE_KEY!,
      { expiresIn: '7d' },
    );

    res.cookie('access_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 60 * 60 * 1000,
    });
  } catch (error) {
    logger.error(error);

    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  return next();
}
