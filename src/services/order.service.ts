import { ERROR_MESSAGES } from '../constants';
import { ICartResponse } from '../types';
import { logger, normalizeCart } from '../helpers';
import { CartRepository } from '../repositories';

export class OrderService {
  static async createOrder(userId: string) {
    try {
      const cart = await CartRepository.getCart(userId) as ICartResponse;
      const normalizedCart = normalizeCart(cart);

      if (normalizedCart.cart.items.length === 0) {
        return { data: null, error: { message: ERROR_MESSAGES[400].EMPTY_CART } };
      }

      const order = {
        userId,
        cartId: normalizedCart.cart.id,
        items: normalizedCart.cart.items,
        payment: {
          type: 'credit card',
          address: '1234 Main Street',
          creditCard: '1234-1234-1234-1234',
        },
        delivery: {
          type: 'express',
          address: '1234 Main Street',
        },
        comments: 'Please deliver between 9am and 5pm',
        status: 'created',
        total: normalizedCart.total,
      };

      return {
        data: { order },
        error: null,
      };
    } catch (error) {
      logger.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
