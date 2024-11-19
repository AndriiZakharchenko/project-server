import { ERROR_MESSAGES } from '../constants';
import { ProductRepository } from '../repositories/product.repository';

export class ProductService {
  static async getAllProducts() {
    try {
      const products = await ProductRepository.getAllProducts();

      if (!products || JSON.stringify(products) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
      }

      return { data: products, error: null };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  // static async getProductById(productId: string) {
  //   try {
  //     const product = await ProductRepository.getProductById(productId);
  //
  //     if (!product || JSON.stringify(product) === '[]') {
  //       return { data: null, error: { message: ERROR_MESSAGES[404].NOT_FOUND } };
  //     }
  //
  //     return {
  //       data: product,
  //       error: null,
  //     };
  //   } catch (error) {
  //     return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
  //   }
  // }
}
