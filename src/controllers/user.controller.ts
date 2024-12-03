import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { UserService } from '../services';

export class UserController {
  static async registerUser(req: Request, res: Response) {
    const data = await UserService.registerUser(req.body);
    return res.status(getStatus(data.error)).json(data);
  }

  static async loginUser(req: Request, res: Response) {
    const data = await UserService.loginUser(req.body);
    return res.status(getStatus(data.error)).json(data);
  }
}
