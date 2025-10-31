import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { OrderService } from '../services';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    // @ts-ignore
    const data = await OrderService.createOrder(req.user.id);
    return res.status(getStatus(data.error)).json(data);
  }
}
