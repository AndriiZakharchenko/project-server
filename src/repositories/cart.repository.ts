import { ERROR_MESSAGES } from '../constants';
import CartModel from '../models/cart.model';
import { ICartItem } from '../types';
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
      // Check if cart exists
      await this.getCart(userId);

      // Check if product exists
      const product = await ProductModel.findOne({ id: productId });
      if (!product) {
        return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
      }

      // Check if product is already in cart
      const cart = await CartModel.findOne({ 'cart.id': userId }).populate('cart.items.product');
      const itemExists = cart?.cart.items.some((item) => item.product.id === productId);
      console.log(JSON.parse(JSON.stringify(cart)), 'cart');
      console.log(itemExists, 'itemExists');
      // TODO: Fix this
      // const data = await CartModel.findOne({
      //   'cart.id': userId,
      //   'cart.items': { $elemMatch: { 'product.id': productId } },
      // });

      if (itemExists === false) {
        const updatedCart = await CartModel.findOneAndUpdate(
          { 'cart.id': userId },
          { $push: { 'cart.items': { product, count } } },
          { new: true },
        ).populate('cart.items.product');

        return { data: updatedCart, error: null };
      }

      // TODO: Fix this
      // Remove product if count is 0
      if (count === 0) {
        const updatedCart = await CartModel.findOneAndUpdate(
          { 'cart.id': userId },
          { $pull: { 'cart.items': { product: productId } } },
          { new: true },
        ).populate('cart.items.product');

        return { data: updatedCart, error: null };
      }

      // Update existing product count
      const updatedCart = await CartModel.findOneAndUpdate(
        { 'cart.id': userId, 'cart.items.product.id': productId },
        { $set: { 'cart.items.$.count': count } },
        { new: true },
      ).populate('cart.items.product');
      console.log(updatedCart, 'updatedCart1');

      return { data: updatedCart, error: null };
    } catch (error) {
      return error;
    }
  }

  static deleteCart(userId: string) {
    return CartModel.deleteOne({ 'cart.id': userId });
  }
}
