import { ERROR_MESSAGES } from '../constants';
import CartModel from '../models/cart.model';
import { ICartItem, IProduct } from '../types';
import ProductModel from '../models/product.model';

export class CartRepository {
  static async getCart(userId: string) {
    try {
      const data = await CartModel.find({ 'cart.id': userId });

      if (!data || JSON.stringify(data) === '[]') {
        const newCart = new CartModel({
          cart: {
            id: userId,
            items: [],
          },
        });

        await newCart.save();
        return newCart;
      }

      return data;
    } catch (error) {
      return error;
    }
  }

  static async updateCart(userId: string, { productId, count }: ICartItem) {
    try {
      const data = await CartModel.findOne({ 'cart.id': userId }, { 'cart.items': { $elemMatch: { 'product.id': productId } } });
      const product = await ProductModel.findOne({ id: productId });

      if (!product) {
        return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
      }

      if (!data || JSON.stringify(data) === '[]') {
        const newCart = new CartModel({
          cart: {
            id: userId,
            items: [
              {
                product,
                count,
              },
            ],
          },
        });

        console.log(newCart, 'newCart');

        await newCart.save();
        return { data: newCart, error: null };
      }

      return { data, error: null };
    } catch (error) {
      return error;
    }
  }

  static deleteCart(userId: string) {
    return CartModel.deleteOne({ 'cart.id': userId });
  }
}
