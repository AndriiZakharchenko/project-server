import { Request, Response } from 'express';
import { ProductService } from '../services';
import { getStatus } from '../helpers';

export class ProductController {
  static async addProduct(req: Request, res: Response) {
    const { title, description, price } = req.body;
    const { image_url } = req.files;
    const data = await ProductService.addProduct({
      title, description, price, image_url,
    });

    return res.status(getStatus(data.error)).json(data);
  }

  static async getAllProducts(req: Request, res: Response) {
    const data = await ProductService.getAllProducts();
    return res.status(getStatus(data.error)).json(data);
  }

  static async getProductById(req: Request, res: Response) {
    const data = await ProductService.getProductById(req.params.productId);
    return res.status(getStatus(data.error)).json(data);
  }
}
