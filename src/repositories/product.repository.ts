import { RequestContext } from '@mikro-orm/core';
import { Products } from '../entities';
import { IProduct } from '../types';

export class ProductRepository {
  static async addProduct({
    title, description, image_url, price,
  }: IProduct) {
    const em = RequestContext.getEntityManager();

    const product = em!.create(Products, {
      title, description, image_url, price,
    });

    return em!.persistAndFlush(product);
  }

  static async getAllProducts() {
    const em = RequestContext.getEntityManager();
    return em!.find(Products, {});
  }

  static async getProductById(productId: string) {
    const em = RequestContext.getEntityManager();
    return em!.findOne(Products, { id: productId });
  }
}
