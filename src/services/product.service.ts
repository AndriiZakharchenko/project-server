import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ERROR_MESSAGES } from '../constants';
import { ProductRepository } from '../repositories';
import { logger } from '../helpers';
import { IProductRaw } from '../types';

export class ProductService {
  static async addProduct({
    title, description, image_url, price,
  }: IProductRaw) {
    try {
      const fileName = `${uuidv4()}.jpg`;
      await image_url.mv(path.resolve(__dirname, '..', 'static', fileName));

      const product = await ProductRepository.addProduct({
        title, description, price, image_url: fileName,
      });

      return { data: product, error: null };
    } catch (error) {
      logger.error(error);
      return { data: [], error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async getAllProducts() {
    try {
      const products = await ProductRepository.getAllProducts();

      if (!products || JSON.stringify(products) === '[]') {
        return { data: null, error: { message: ERROR_MESSAGES[404].PRODUCT_NOT_FOUND } };
      }

      return { data: products, error: null };
    } catch (error) {
      logger.error(error);
      return { data: [], error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }

  static async getProductById(productId: string) {
    try {
      const product = await ProductRepository.getProductById(productId);

      if (!product || JSON.stringify(product) === '[]') {
        return { data: [], error: { message: ERROR_MESSAGES[404].PRODUCT_NOT_FOUND } };
      }

      return {
        data: product,
        error: null,
      };
    } catch (error) {
      logger.error(error);
      return { data: [], error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
