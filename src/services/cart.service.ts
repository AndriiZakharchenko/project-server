import { response } from 'express';
import { ERROR_MESSAGES } from '../constants';
import { CartRepository } from '../repositories/cart.repository';
import { ICart, ICartItem, IUpdateCartResponse } from '../types';

export class CartService {
  static async getCart(userId: string) {
    try {
      const data = await CartRepository.getCart(userId) as ICart;

      return {
        data,
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async updateCart(userId: string, { productId, count }: ICartItem) {
    try {
      // eslint-disable-next-line max-len
      const { data, error } = await CartRepository.updateCart(userId, { productId, count }) as IUpdateCartResponse;

      console.log(data, 'data');

      if (error) {
        return { data: null, error: { message: error } };
      }

      return {
        data,
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async deleteCart(userId: string) {
    try {
      const status = await CartRepository.deleteCart(userId);

      if (status.deletedCount === 0) {
        return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
