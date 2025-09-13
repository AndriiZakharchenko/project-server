import { Request, Response } from 'express';
import { getStatus } from '../helpers';
import { CartService } from '../services';
import { ICustomRequest } from '../types';

export class CartController {
  /**
   * @swagger
   * /api/profile/cart:
   *   get:
   *     summary: Get user cart
   *     tags: [Cart]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: User cart
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Cart'
   *                 error:
   *                   type: null
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
  static async getCart(req: ICustomRequest, res: Response) {
    // @ts-ignore
    const data = await CartService.getCart(req.user.id);
    return res.status(getStatus(data.error)).json(data);
  }

  /**
   * @swagger
   * /api/profile/cart:
   *   put:
   *     summary: Update user cart
   *     tags: [Cart]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *               - count
   *             properties:
   *               productId:
   *                 type: string
   *                 description: Product ID
   *               count:
   *                 type: integer
   *                 minimum: 1
   *                 description: Count (for ADD and UPDATE)
   *     responses:
   *       200:
   *         description: Cart successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         description: Invalid request data
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
   */
  static async updateCart(req: Request, res: Response) {
    // @ts-ignore
    const data = await CartService.updateCart(req.user.id, req.body);
    return res.status(getStatus(data.error)).json(data);
  }

  /**
   * @swagger
   * /api/profile/cart:
   *   delete:
   *     summary: Clear user cart
   *     tags: [Cart]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Cart successfully cleared
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
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
  static async deleteCart(req: Request, res: Response) {
    // @ts-ignore
    const data = await CartService.deleteCart(req.user.id);
    return res.status(getStatus(data.error)).json(data);
  }
}
