import { Request, Response } from 'express';
import { getUserCartService } from '../services/cart.service';
import { validateUser } from '../validations/user.validation';

export const getUserCartController = async (req: Request, res: Response) => {
  try {
    validateUser(req, res);

    const cart = await getUserCartService(req.headers['x-user-id'] as string);

    if (cart === undefined) {
      return res.status(404).json({
        data: null,
        error: { message: 'Cart not found' },
      });
    }

    return res.status(200).json({
      data: {
        cart: {
          id: cart.cartId,
          items: cart.items,
        },
        total: cart.total,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      error: { message: 'Internal Server error' },
    });
  }
};
