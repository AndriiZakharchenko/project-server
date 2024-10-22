import { cart } from '../data/cart';

export const getUserCartRepository = (id: string) => {
  return cart.find((userCarts) => userCarts.userId === id);
};
