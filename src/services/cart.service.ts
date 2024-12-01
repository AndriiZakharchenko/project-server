import { CART_ACTION, ERROR_MESSAGES } from '../constants';
import { CartRepository } from '../repositories/cart.repository';
import {
  ICartProps, ICartResponse, IProduct, IUser,
} from '../types';
import { ProductRepository } from '../repositories/product.repository';
import { normalizeCart } from '../helpers/dataNormalizer.helper';
import { UserRepository } from '../repositories/user.repository';

export class CartService {
  static async getCart(userId: string) {
    try {
      const data = await CartRepository.getCart(userId) as ICartResponse | null;

      // Check if cart is empty
      if (!data || JSON.stringify(data) === '[]') {
        const cart = await CartRepository.createCart(userId) as ICartResponse;

        // Check if cart is created
        if (cart === null) {
          return { data: null, error: { message: ERROR_MESSAGES[404].CART_NOT_FOUND } };
        }

        return { data: normalizeCart(cart), error: null };
      }

      return { data: normalizeCart(data), error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async updateCart(userId: string, { productId, count }: ICartProps) {
    try {
      const cart = await CartRepository.getCart(userId) as ICartResponse;
      const product = await ProductRepository.getProductById(productId) as IProduct;

      // Check if product exists
      if (!product || JSON.stringify(product) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[400].INVALID_PRODUCT } };
      }

      const normalizedCart = normalizeCart(cart);
      const itemIndex = normalizedCart.cart.items.findIndex((item) => {
        return item.product.id === productId;
      });

      // Check if product is already in cart
      if (itemIndex === -1) {
        await CartRepository.updateItems({
          cartId: normalizedCart.cart.id, productId, count, type: CART_ACTION.ADD,
        });
      } else {
        await CartRepository.updateItems({
          cartId: normalizedCart.cart.id, productId, count, type: CART_ACTION.UPDATE,
        });
      }

      if (count === 0) {
        await CartRepository.updateItems({
          cartId: normalizedCart.cart.id, productId, count, type: CART_ACTION.REMOVE,
        });
      }

      // Update total
      await CartRepository.updateTotal(userId);
      const updatedCart = await CartRepository.getCart(userId) as ICartResponse;
      return { data: normalizeCart(updatedCart), error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async deleteCart(userId: string) {
    try {
      const user = await UserRepository.getUserById(userId) as IUser;
      if (!user || JSON.stringify(user) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[404].USER_NOT_FOUND } };
      }

      if (user.role !== 'admin') {
        return { data: null, error: { message: ERROR_MESSAGES[403].FORBIDDEN } };
      }

      const data = await CartRepository.deleteCart(userId);
      // Check if cart is deleted
      if (data === null) {
        return { data: null, error: { message: ERROR_MESSAGES[404].CART_NOT_FOUND } };
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
