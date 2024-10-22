import { Request, Response } from 'express';

export function validateUser(req: Request, res:Response) {
  if (req.headers['x-user-id'] !== 'test-user-id') {
    return res.status(401).json({
      data: null,
      error: { message: 'User is not authorized' },
    });
  }

  if (!req.headers['x-user-id']) {
    return res.status(403).json({
      data: null,
      error: { message: 'You must be authorized user' },
    });
  }

  return true;
}
