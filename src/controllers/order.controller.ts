import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { OrderService } from '../services';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    const data = await OrderService.createOrder(req.headers['x-user-id'] as string);
    return res.status(getStatus(data.error)).json(data);
  }
}
