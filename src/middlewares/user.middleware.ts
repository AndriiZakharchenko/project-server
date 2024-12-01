import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/auth')) {
    return next();
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
    console.error(error);
    return res.status(403).json({
      data: null,
      error: { message: ERROR_MESSAGES[403].INVALID_TOKEN },
    });
  }

  return next();
}
