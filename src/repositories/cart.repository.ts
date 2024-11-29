import { RequestContext } from '@mikro-orm/core';
import { CartItems, Carts, Products } from '../entities';
import { ICart } from '../types';

export class CartRepository {
  static async createCart(userId: string) {
    const em = RequestContext.getEntityManager();
    return em!.create(Carts, {
      total: 0,
      user: userId,
    });

    // const product = await em!.findOneOrFail(Products, { id: 'c28e1102-a952-4c8e-92f7-e2c34d30af95' });
    // const cartItem = em!.create(CartItems, {
    //   count: 1,
    //   cart: newCart,
    //   product,
    // });
    //
    // newCart.items.add(cartItem);
    // await em!.persistAndFlush(newCart);
  }

  static getCart(userId: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Carts, { user: userId }, { populate: ['items.product'] });
  }

  static async updateCart(userId: string, { cart, total }: ICart) {
    const em = RequestContext.getEntityManager();
    const userCart = await this.getCart(userId) as unknown as ICart;

    userCart.total = total;
    userCart.cart = cart;

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
