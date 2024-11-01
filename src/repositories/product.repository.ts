import ProductModel from '../schemas/product.schema';

export class ProductRepository {
  static getAllProducts() {
    return ProductModel.find();
  }

  static getProductById(productId: string) {
    return ProductModel.findOne({ id: productId });
  }
}
