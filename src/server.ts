import 'reflect-metadata';

import express, { Router } from 'express';
import { MikroORM } from '@mikro-orm/postgresql';
import { RequestContext } from '@mikro-orm/core';
import * as dotenv from 'dotenv';
import config from '../mikro-orm.config';

import { ProductController } from './controllers/product.controller';
import { CartController } from './controllers/cart.controller';
import { OrderController } from './controllers/order.controller';
import { UserController } from './controllers/user.controller';

import { verifyToken } from './middlewares/user.middleware';
import { validateSchema } from './middlewares/validate.middleware';
import { ERROR_MESSAGES } from './constants';
import { updateCartSchema } from './validations/product.validation';

dotenv.config();

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

  // User routes
  router.post('/api/auth/login', UserController.loginUser);
  router.post('/api/auth/register', UserController.registerUser);

  // User middleware
  app.use('/api', verifyToken);

  // Product routes
  router.get('/api/products', ProductController.getAllProducts);
  router.get('/api/products/:productId', ProductController.getProductById);

  // // Cart routes
  router.get('/api/profile/cart', CartController.getCart);
  router.put('/api/profile/cart', validateSchema(updateCartSchema), CartController.updateCart);
  router.delete('/api/profile/cart', CartController.deleteCart);

  // Order routes
  router.post('/api/profile/cart/checkout', OrderController.createOrder);

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
