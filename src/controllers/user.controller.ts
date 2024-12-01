import { Request, Response } from 'express';
import { getStatus } from '../helpers/status.helper';
import { UserService } from '../services/user.service';

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
