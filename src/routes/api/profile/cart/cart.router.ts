import { Router } from 'express';
import { getUserCartController } from '../../../../controllers/cart.controller';

const router = Router();

router.get('/', getUserCartController);
// router.post('/checkout', createCartController);
// router.put('/', updateCartController);
// router.delete('/', deleteCartController);

export default router;
