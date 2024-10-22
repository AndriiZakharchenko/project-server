import { Request, Response } from 'express';
import { getAllProductsService, getProductService } from '../services/product.service';
import { validateUser } from '../validations/user.validation';

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    validateUser(req, res);

    const products = await getAllProductsService();
    return res.status(200).json({
      data: products,
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      error: { message: 'Internal Server error' },
    });
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    validateUser(req, res);

    const product = await getProductService(req.params.productId);
    return res.status(200).json({
      data: product,
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      error: { message: 'Internal Server error' },
    });
  }
};
