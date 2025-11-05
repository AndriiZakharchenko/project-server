import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { UserService } from '../services';
import { ICustomRequest } from '../types';

export class UserController {
  static async registerUser(req: Request, res: Response) {
    const result = await UserService.registerUser(req.body);

    if (result.data) {
      res.cookie('refreshToken', result.data.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }
    return res.status(getStatus(result.error)).json(result);
  }

  static async loginUser(req: ICustomRequest, res: Response) {
    const { data, error } = await UserService.loginUser(req.body);

    if (data) {
      req.user = data.user;

      res.cookie('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 20 * 1000,
      });
    }

    return res.status(getStatus(error)).json({ data: data?.token || null, error });
  }

  static logoutUser(req: ICustomRequest, res: Response) {
    res.clearCookie('token');
    return res.status(200).json();
  }

  static async check(req: ICustomRequest, res: Response) {
    return res.status(200).json({ data: req.user || null, error: null });
  }

  static async activateLink(req: ICustomRequest, res: Response) {
    const result = await UserService.activateLink(req.params.link);

    return res.status(getStatus(result.error)).json(result);
  }
}
