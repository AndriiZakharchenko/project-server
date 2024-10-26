import { products } from '../data/products';

export class Product {
  static getAllProducts() {
    return Promise.resolve(products);
  }

  static getProduct(productId: string) {
    const product = products.find((item) => item.id === productId);

    return Promise.resolve(product);
  }
}
