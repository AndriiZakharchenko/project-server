import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ProductService } from '../services';
import { getStatus } from '../helpers';

export class ProductController {
  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Add a new product
   *     tags: [Products]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - price
   *             properties:
   *               title:
   *                 type: string
   *                 description: Product title
   *                 example: "Product Name"
   *               description:
   *                 type: string
   *                 description: Product description
   *                 example: "Detailed product description"
   *               price:
   *                 type: number
   *                 minimum: 0
   *                 description: Product price
   *                 example: 99.99
   *               image_url:
   *                 type: string
   *                 format: binary
   *                 description: Product image
   *     responses:
   *       201:
   *         description: Product successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Product'
   *                 error:
   *                   type: null
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products list
   *     tags: [Products]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 6
   *         description: Number of products per page
   *     responses:
   *       200:
   *         description: Products list
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     products:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Product'
   *                     total:
   *                       type: integer
   *                       description: Total number of products
   *                 error:
   *                   type: null
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getAllProducts(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const data = await ProductService.getAllProducts({ page, limit });
    return res.status(getStatus(data.error)).json(data);
  }

  /**
   * @swagger
   * /api/products/{productId}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *         description: Unique product identifier
   *     responses:
   *       200:
   *         description: Product details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Product'
   *                 error:
   *                   type: null
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getProductById(req: Request, res: Response) {
    const data = await ProductService.getProductById(req.params.productId);
    return res.status(getStatus(data.error)).json(data);
  }
}
