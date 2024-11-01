import { ERROR_MESSAGES } from '../constants';
import { ICart, ICartItem } from '../types';
import CartModel from '../schemas/cart.schema';
import ProductModel from '../schemas/product.schema';

export class CartRepository {
  static async createCart(userId: string) {
    try {
      const newCart = new CartModel({
        cart: {
          id: userId,
          items: [],
        },
      });

      await newCart.save();
      return newCart;
    } catch (error) {
      return error;
    }
  }

  static getCart(userId: string) {
    try {
      return CartModel.findOne({ 'cart.id': userId }).populate('cart.items.product');
    } catch (error) {
      return error;
    }
  }

  static updateCart(userId: string, { cart, total }: ICart) {
    try {
      return CartModel.findOneAndUpdate(
        { 'cart.id': userId },
        { $set: { cart, total } },
        { new: true },
      ).populate('cart.items.product');
    } catch (error) {
      return error;
    }
  }

  static deleteCart(userId: string) {
    return CartModel.deleteOne({ 'cart.id': userId });
  }
}
