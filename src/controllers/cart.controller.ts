import { Request, Response } from 'express';
import { getStatus } from '../helpers/status.helper';
import { CartService } from '../services/cart.service';

export class CartController {
  static async getCart(req: Request, res: Response) {
    const data = await CartService.getCart(req.headers['x-user-id'] as string);
    return res.status(getStatus(data.error)).json(data);
  }

  // static async updateCart(req: Request, res: Response) {
  //   const data = await CartService.updateCart(req.headers['x-user-id'] as string, req.body);
  //       return res.status(getStatus(data.error)).json(data);
  // }

  // static async deleteCart(req: Request, res: Response) {
  //   const data = await CartService.deleteCart(req.headers['x-user-id'] as string);
  //   return res.status(getStatus(data.error)).json(data);
  // }
}
