// import { Request, Response } from 'express';
// import { getStatus } from '../helpers/status.helper';
// import { OrderService } from '../services/order.service';
//
// export class OrderController {
//   static async createOrder(req: Request, res: Response) {
//     const data = await OrderService.createOrder(req.headers['x-user-id'] as string);
//     const status = data.error === null ? 200 : getStatus(data.error.message);
//     return res.status(status).json(data);
//   }
// }
