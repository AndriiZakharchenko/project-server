import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { getStatus } from '../helpers/status.helper';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    const data = await ProductService.getAllProducts();
    const status = data.error === null ? 200 : getStatus(data.error.message);
    return res.status(status).json(data);
  }

  // static async getProductById(req: Request, res: Response) {
  //   const data = await ProductService.getProductById(req.params.productId);
  //   const status = data.error === null ? 200 : getStatus(data.error.message);
  //   return res.status(status).json(data);
  // }
}
