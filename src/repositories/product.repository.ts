import { RequestContext } from '@mikro-orm/core';
import { Product } from '../entities';
// import pool from '../../pg-pool.config';
// import { executeQuery } from '../helpers/executeQuery.helper';

export class ProductRepository {
  static async getAllProducts() {
    // Get the EntityManager from the RequestContext
    const em = RequestContext.getEntityManager();

    if (!em) {
      throw new Error('EntityManager not available in RequestContext');
    }

    try {
      // Fetch all products
      const products = await em.find(Product, {});
      console.log('Fetched products:', products);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error; // Rethrow the error for handling in a higher layer
    }
  }

  // static async getAllProducts() {
  //   const a = RequestContext.getEntityManager()!.find(Product, {});
  //   console.log('test', a);
  //   return a;
  // SQL query
  // const query = 'SELECT * FROM products';
  //
  // return executeQuery(query);
  // }

  // static async getProductById(productId: string) {
  //   return orm.em.findOne(Product, { id: productId });
  // }
}
