import { Router } from 'express';
import { getAllProductsController, getProductController } from '../../../controllers/product.controller';

const router = Router();

router.get('/', getAllProductsController);
router.get('/:productId', getProductController);

export default router;
