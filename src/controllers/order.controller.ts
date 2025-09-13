import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { OrderService } from '../services';

export class OrderController {
  /**
   * @swagger
   * /api/profile/cart/checkout:
   *   post:
   *     summary: Create order from cart
   *     tags: [Orders]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Order successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     order:
   *                       type: object
   *                       properties:
   *                         userId:
   *                           type: string
   *                         cartId:
   *                           type: string
   *                         items:
   *                           type: array
   *                           items:
   *                             type: object
   *                         payment:
   *                           type: object
   *                         delivery:
   *                           type: object
   *                         comments:
   *                           type: string
   *                         status:
   *                           type: string
   *                         total:
   *                           type: number
   *                 error:
   *                   type: null
   *       400:
   *         description: Cart is empty or invalid data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async createOrder(req: Request, res: Response) {
    // @ts-ignore
    const data = await OrderService.createOrder(req.user.id);
    return res.status(getStatus(data.error)).json(data);
  }
}
