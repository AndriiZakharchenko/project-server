import { cart as cartData } from '../data/cart';
import { OrderEntity } from '../schemas/order.entity';
import { products } from '../data/products';
import { ERROR_MESSAGES } from '../constants';

const usersCart: OrderEntity[] = structuredClone(cartData);

type CartItem = {
  productId: string;
  count: number;
}

export class Cart {
  static getCart(userId: string) {
    const cart = usersCart.find((item) => item.userId === userId);

    return Promise.resolve(cart);
  }

  static createCart(userId: string, { productId, count }: CartItem) {
    const cartIndex = usersCart.findIndex((item) => item.userId === userId);
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return Promise.resolve({
        data: null,
        error: ERROR_MESSAGES[404].NOT_FOUND,
      });
    }

    usersCart[cartIndex].items.push({
      product,
      count,
    });
    usersCart[cartIndex].total = product.price * count;

    return Promise.resolve({ data: usersCart[cartIndex], error: null });
  }

  static updateCart(userId: string, { productId, count }: CartItem) {
    const cartIndex = usersCart.findIndex((item) => item.userId === userId);
    // eslint-disable-next-line max-len
    const productIndex = usersCart[cartIndex].items.findIndex((item) => item.product.id === productId);
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return Promise.resolve({
        data: null,
        error: ERROR_MESSAGES[404].NOT_FOUND,
      });
    }

    if (productIndex === -1) {
      usersCart[cartIndex].items.push({
        product,
        count,
      });
    } else {
      usersCart[cartIndex].items[productIndex].count = count;
    }

    // eslint-disable-next-line max-len
    usersCart[cartIndex].total = usersCart[cartIndex].items.reduce((acc, item) => acc + item.product.price * item.count, 0);
    return Promise.resolve({ data: usersCart[cartIndex], error: null });
  }

  static deleteCart(userId: string) {
    const findIndex = usersCart.findIndex((item) => item.userId === userId);
    usersCart[findIndex].items = [];
    usersCart[findIndex].total = 0;

    return Promise.resolve(true);
  }
}
