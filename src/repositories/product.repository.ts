import { RequestContext } from '@mikro-orm/core';
import { Products } from '../entities';

export class ProductRepository {
  static async getAllProducts() {
    const em = RequestContext.getEntityManager();
    return em!.find(Products, {});
  }

  static async getProductById(productId: string) {
    const em = RequestContext.getEntityManager();
    // if (em === null) {
    //
    // }

    return em!.findOne(Products, { id: productId });
  }
}
