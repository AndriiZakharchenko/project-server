import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ProductService } from '../services';
import { getStatus } from '../helpers';

export class ProductController {
  static async addProduct(req: Request, res: Response) {
    const { title, description, price } = req.body;
    const file = (req.files?.image_url as UploadedFile);

    const data = await ProductService.addProduct({
      title,
      description,
      price: Number(price),
      image_url: file,
    });

    return res.status(getStatus(data.error)).json(data);
  }

  static async getAllProducts(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const data = await ProductService.getAllProducts({ page, limit });
    return res.status(getStatus(data.error)).json(data);
  }

  static async getProductById(req: Request, res: Response) {
    const data = await ProductService.getProductById(req.params.productId);
    return res.status(getStatus(data.error)).json(data);
  }
}
