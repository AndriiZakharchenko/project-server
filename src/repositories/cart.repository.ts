import { RequestContext } from '@mikro-orm/core';
import { ICart } from '../types';
import { Carts, Users } from '../entities';

export class CartRepository {
  static async createCart(userId: string) {
    const em = RequestContext.getEntityManager();
    // await em!.begin();
    const newCart = em!.create(Carts, {
      // id: 'f47c79f3-8d76-4e6f-b07b-63efcd56e812',
      total: 0,
      user: userId,
    });

    await em!.persistAndFlush(newCart);
    // await em!.commit();
    console.log('newCart', newCart);

    return {
      ...newCart,
      items: [],
    };
  }

  static getCart(userId: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Carts, { user: userId });
  }
  //
  // static async updateCart(userId: string, { cart, total }: ICart) {
  //   const em = RequestContext.getEntityManager();
  //
  //   // Find the user's cart, including its cart items (populate 'cart' relationship)
  //   const userCart = await em!.findOne(Carts, { user: userId }, { populate: ['cart'] });
  //
  //   if (!userCart) {
  //     throw new Error('Cart not found for the given user');
  //   }
  //
  //   // Update the total
  //   userCart.total = total;
  //
  //   // Clear existing cart items
  //   userCart.cart.removeAll();
  //
  //   // Add new cart items to the cart
  //   userCart.cart.items.forEach((item) => {
  //     const cartItem = em!.create(CartItem, {
  //       cart: userCart, // Link the item to the user's cart
  //       product: item.productId, // Assume `productId` is the ID of the product
  //       count: item.count, // Count of the product in the cart
  //     });
  //     userCart.cart.add(cartItem); // Add the new item to the cart's collection
  //   });
  //
  //   // Persist the updated cart and its items
  //   await em!.persistAndFlush(userCart);
  //
  //   return userCart;
  // }

  // static async deleteCart(userId: string) {
  //   const em = RequestContext.getEntityManager();
  //   const cart = await em!.findOne(Carts, { user: userId });
  //
  //   if (!cart) {
  //     return null;
  //   }
  //
  //   return em!.remove(cart).flush();
  // }
}
