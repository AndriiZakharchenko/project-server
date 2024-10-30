import { Request, Response } from 'express';
import { getStatus } from '../helpers/status.helper';
import { CartService } from '../services/cart.service';

export class CartController {
  static async getCart(req: Request, res: Response) {
    const data = await CartService.getCart(req.headers['x-user-id'] as string);
    const status = data.error === null ? 200 : getStatus(data.error.message);
    return res.status(status).json(data);
  }

  // static async createCart(req: Request, res: Response) {
  //   const data = await CartService.createCart(req.headers['x-user-id'] as string, req.body);
  //   const status = data.error === null ? 201 : getStatus(data.error.message);
  //   return res.status(status).json(data);
  // }

  static async updateCart(req: Request, res: Response) {
    const data = await CartService.updateCart(req.headers['x-user-id'] as string, req.body);
    // const status = data.error === null ? 200 : getStatus(data.error.message);
    return res.status(200).json(data);
  }

  static async deleteCart(req: Request, res: Response) {
    const data = await CartService.deleteCart(req.headers['x-user-id'] as string);
    const status = data.error === null ? 200 : getStatus(data.error.message);
    return res.status(status).json(data);
  }
}
