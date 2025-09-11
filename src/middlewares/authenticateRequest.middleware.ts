import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants';
import { logger } from '../helpers';
import { ICustomRequest, IUser } from '../types';

export async function authenticateRequest(req: ICustomRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      data: null,
      error: { message: ERROR_MESSAGES[401].TOKEN_REQUIRED },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY!) as Omit<IUser, 'password'>;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.PRIVATE_KEY!,
      { expiresIn: '20s' },
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      // maxAge: 15 * 60 * 1000,
      maxAge: 20 * 1000,
    });
  } catch (error) {
    logger.error(error);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  return next();
}
