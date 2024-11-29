import 'reflect-metadata';
import express, { Router } from 'express';
import { MikroORM } from '@mikro-orm/postgresql';
import { RequestContext } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { ERROR_MESSAGES } from './constants';
import { validateUser } from './middlewares/user.middleware';
import { ProductController } from './controllers/product.controller';
import { CartController } from './controllers/cart.controller';
import { OrderController } from './controllers/order.controller';
import { validateSchema } from './middlewares/validate.middleware';
import { updateCartSchema } from './validations/product.validation';

const PORT = process.env.PORT || 8000;

async function startServer() {
  // Initialize MikroORM
  const orm = await MikroORM.init(config);
  console.log('Connected to PostgreSQL database via MikroORM');

  const app = express();
  const router = Router();

  app.use(express.json());

  // MikroORM RequestContext middleware
  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  // Product routes
  router.get('/api/products', validateUser, ProductController.getAllProducts);
  router.get('/api/products/:productId', validateUser, ProductController.getProductById);

  // // Cart routes
  router.get('/api/profile/cart', validateUser, CartController.getCart);
  router.put('/api/profile/cart', validateUser, validateSchema(updateCartSchema), CartController.updateCart);
  router.delete('/api/profile/cart', validateUser, CartController.deleteCart);

  // Order routes
  router.post('/api/profile/cart/checkout', validateUser, OrderController.createOrder);

  app.use(router);

  // 404 Route handler
  app.all('*', (req, res) => {
    res.status(404).json({ message: ERROR_MESSAGES[404].PRODUCT_NOT_FOUND });
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
