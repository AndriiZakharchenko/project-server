import { ERROR_MESSAGES } from '../constants';
import { Product } from '../repositories/product.repository';

export class ProductService {
  static async getAllProducts() {
    try {
      const products = await Product.getAllProducts();

      if (!products) {
        return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
      }

      return { data: products, error: null };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async getProduct(productId: string) {
    try {
      const product = await Product.getProduct(productId);

      if (!product) {
        return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
      }

      return {
        data: product,
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
