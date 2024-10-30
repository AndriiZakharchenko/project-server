import ProductModel from '../models/product.model';

export class ProductRepository {
  static getAllProducts() {
    return ProductModel.find();
  }

  static getProduct(productId: string) {
    return ProductModel.findOne({ id: productId });
  }
}
