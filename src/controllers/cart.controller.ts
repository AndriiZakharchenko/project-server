import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { CartService } from '../services';
import { ICustomRequest } from '../types';

export class CartController {
  static async getCart(req: ICustomRequest, res: Response) {
    // @ts-ignore
    const data = await CartService.getCart(req.user.id);
    return res.status(getStatus(data.error)).json(data);
  }

  static async updateCart(req: Request, res: Response) {
    // @ts-ignore
    const data = await CartService.updateCart(req.user.id, req.body);
    return res.status(getStatus(data.error)).json(data);
  }

  static async deleteCart(req: Request, res: Response) {
    // @ts-ignore
    const data = await CartService.deleteCart(req.user.id);
    return res.status(getStatus(data.error)).json(data);
  }
}
