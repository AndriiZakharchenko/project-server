import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { UserService } from '../services';
import { ICustomRequest } from '../types';

export class UserController {
  static async registerUser(req: Request, res: Response) {
    const data = await UserService.registerUser(req.body);
    return res.status(getStatus(data.error)).json(data);
  }

  static async loginUser(req: ICustomRequest, res: Response) {
    const { data, error } = await UserService.loginUser(req.body);
    if (data) {
      req.user = data.user;

      res.cookie('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
      });
    }
    return res.status(getStatus(error)).json({ data: data?.token || null, error });
  }
}
