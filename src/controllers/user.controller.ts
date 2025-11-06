import { Request, Response } from 'express';
import { getStatus, setRefreshTokenCookie } from '../helpers';
import { UserService, TokenService } from '../services';
import { ICustomRequest } from '../types';

export class UserController {
  static async registerUser(req: Request, res: Response) {
    const result = await UserService.registerUser(req.body);

    if (result.data) {
      setRefreshTokenCookie(res, result.data.tokens.refreshToken);
    }

    return res.status(getStatus(result.error)).json(result);
  }

  static async loginUser(req: ICustomRequest, res: Response) {
    const result = await UserService.loginUser(req.body);

    if (result.data) {
      setRefreshTokenCookie(res, result.data.tokens.refreshToken);
    }

    return res.status(getStatus(result.error)).json(result);
  }

  static async logoutUser(req: ICustomRequest, res: Response) {
    const result = await UserService.logoutUser(req.cookies.refreshToken);

    res.clearCookie('refreshToken');
    return res.status(getStatus(result.error)).json(result);
  }

  static async check(req: ICustomRequest, res: Response) {
    return res.status(200).json({ data: req.user || null, error: null });
  }

  static async activateLink(req: ICustomRequest, res: Response) {
    const result = await UserService.activateLink(req.params.link);

    if (result.error?.message) {
      return res.status(getStatus(result.error)).json(result);
    }

    return res.redirect(process.env.CLIENT_URL!);
  }

  static async refreshToken(req: ICustomRequest, res: Response) {
    const result = await TokenService.refreshToken(req.cookies.refreshToken);

    if (result.data) {
      setRefreshTokenCookie(res, result.data.tokens.refreshToken);
    }

    return res.status(getStatus(result.error)).json(result);
  }
}
