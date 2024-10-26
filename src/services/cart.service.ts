import { ERROR_MESSAGES } from '../constants';
import { Cart } from '../repositories/cart.repository';
import { OrderEntity } from '../schemas/order.entity';

type CartItem = {
  productId: string;
  count: number;
}

export class CartService {
  static async getCart(userId: string) {
    try {
      const { id, items, total } = await Cart.getCart(userId) as OrderEntity;

      return {
        data: {
          cart: {
            id,
            items,
          },
          total,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async createCart(userId: string, { productId, count }: CartItem) {
    try {
      const response = await Cart.createCart(userId, { productId, count });

      if (response.error) {
        return { data: null, error: { message: response.error } };
      }

      return {
        data: {
          order: response.data,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async updateCart(userId: string, { productId, count }: CartItem) {
    try {
      // eslint-disable-next-line max-len
      const response = await Cart.updateCart(userId, { productId, count });

      if (response.error) {
        return { data: null, error: { message: response.error } };
      }

      const { id, items, total } = response.data as OrderEntity;

      return {
        data: {
          cart: {
            id,
            items,
          },
          total,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async deleteCart(userId: string) {
    try {
      await Cart.deleteCart(userId);

      return {
        data: {
          success: true,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
