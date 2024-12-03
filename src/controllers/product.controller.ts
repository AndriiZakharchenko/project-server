import { Request, Response } from 'express';
import { ProductService } from '../services';
import { getStatus } from '../helpers';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    const data = await ProductService.getAllProducts();
    return res.status(getStatus(data.error)).json(data);
  }

  static async getProductById(req: Request, res: Response) {
    const data = await ProductService.getProductById(req.params.productId);
    return res.status(getStatus(data.error)).json(data);
  }
}
