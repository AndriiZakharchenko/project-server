import { RequestContext } from '@mikro-orm/core';
import { Product } from '../entities';
import pool from '../../pg-pool.config';
import { executeQuery } from '../helpers/executeQuery.helper';

export class ProductRepository {
  static async getAllProducts() {
    console.log('test');
    // eslint-disable-next-line max-len
    // console.log('RequestContext.getEntityManager()!.find(Product, {})', RequestContext.getEntityManager()!.find(Product, {}));
    // return RequestContext.getEntityManager()!.find(Product, {});
    const query = 'SELECT * FROM products';

    return executeQuery(query);
  }

  // static async getProductById(productId: string) {
  //   return orm.em.findOne(Product, { id: productId });
  // }
}
