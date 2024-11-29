import { RequestContext } from '@mikro-orm/core';
import { CartItems, Carts } from '../entities';
import {
  ICart, ICartAction, ICartItem, ICartResponse,
} from '../types';
import { CART_ACTION } from '../constants';

export class CartRepository {
  static async createCart(userId: string) {
    const em = RequestContext.getEntityManager();
    const cart = em!.create(Carts, {
      total: 0,
      user: userId,
    });

    await em!.persistAndFlush(cart);
    return cart;
  }

  static getCart(userId: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Carts, { user: userId }, { populate: ['items.product'] });
  }

  static async updateItems({
    cartId, productId, count, type,
  }: ICartAction) {
    const em = RequestContext.getEntityManager();
    // eslint-disable-next-line max-len
    const cartItem = await em!.findOne(CartItems, { cart: cartId, product: productId }) as ICartItem;

    switch (type) {
      case CART_ACTION.ADD: {
        const newCartItem = em!.create(CartItems, {
          cart: cartId,
          product: productId,
          count,
        });

        await em!.persistAndFlush(newCartItem);
        break;
      }
      case CART_ACTION.UPDATE: {
        cartItem.count = count;

        await em!.persistAndFlush(cartItem);
        break;
      }
      case CART_ACTION.REMOVE: {
        await em!.remove(cartItem).flush();
        break;
      }
      default:
        break;
    }

    return null;
  }

  static async updateTotal(userId: string) {
    const em = RequestContext.getEntityManager();
    const userCart = await this.getCart(userId) as ICartResponse;

    userCart.total = userCart.items.getItems().reduce((acc, item) => {
      return acc + item.product.price * item.count;
    }, 0);

    return em!.persistAndFlush(userCart);
  }

  static async deleteCart(userId: string) {
    const em = RequestContext.getEntityManager();
    const cart = await em!.findOne(Carts, { user: userId });

    if (!cart) {
      return null;
    }

    return em!.remove(cart).flush();
  }
}
