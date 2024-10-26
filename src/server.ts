import express, { Router } from 'express';
import { ProductController } from './controllers/product.controller';
import { validateUser } from './middlewares/user.middleware';
import { CartController } from './controllers/cart.controller';
import { validateSchema } from './middlewares/validate.middleware';
import { updateCartSchema } from './schemas/product.schema';

const PORT = process.env.PORT || 8000;

const app = express();
const router = Router();

app.use(express.json());

// Product routes
router.get('/api/products', validateUser, ProductController.getAllProducts);
router.get('/api/products/:productId', validateUser, ProductController.getProduct);

// Cart routes
router.get('/api/profile/cart', validateUser, CartController.getCart);
router.post('/api/profile/cart/checkout', validateUser, validateSchema(updateCartSchema), CartController.createCart);
router.put('/api/profile/cart', validateUser, validateSchema(updateCartSchema), CartController.updateCart);
router.delete('/api/profile/cart', validateUser, CartController.deleteCart);

app.use(router);

app.all('*', (req, res) => {
  res.status(404);
  res.json({ message: '404 Not Found.' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
