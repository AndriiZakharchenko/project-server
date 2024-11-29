import { ERROR_MESSAGES } from '../constants';
import { CartRepository } from '../repositories/cart.repository';
import { ICart, ICartItem, IProduct } from '../types';
import { ProductRepository } from '../repositories/product.repository';
import { normalizeCart } from '../helpers/dataNormalizer.helper';

export class CartService {
  static async getCart(userId: string) {
    try {
      const data = await CartRepository.getCart(userId);

      if (!data || JSON.stringify(data) === '[]') {
        await CartRepository.createCart(userId);
        const cart = await CartRepository.getCart(userId);

        return { data: normalizeCart(cart), error: null };
      }

      return { data: normalizeCart(data), error: null };
    } catch (error) {
      console.log('error', error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async updateCart(userId: string, { productId, count }: ICartItem) {
    try {
      const data = await this.getCart(userId) as unknown as ICart;
      if (!data || JSON.stringify(data) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[404].CART_NOT_FOUND } };
      }

      const product = await ProductRepository.getProductById(productId) as IProduct;
      if (!product || JSON.stringify(product) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_PRODUCT } };
      }

      const itemIndex = data.cart.items.findIndex((item) => item.product.id === productId);
      if (itemIndex === -1) {
        data.cart.items.push({ product, count });
      } else {
        data.cart.items[itemIndex].count = count;
      }

      if (count === 0) {
        data.cart.items = data.cart.items.filter((item) => item.product.id !== productId);
      }

      // eslint-disable-next-line max-len
      data.total = data.cart.items.reduce((acc, item) => acc + (item.product.price * item.count), 0);
      const updatedData = await CartRepository.updateCart(userId, data);
      return { data: updatedData, error: null };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async deleteCart(userId: string) {
    try {
      const data = await CartRepository.deleteCart(userId);

      if (data === null) {
        return { data: null, error: { message: ERROR_MESSAGES[404].CART_NOT_FOUND } };
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
