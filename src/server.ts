import 'reflect-metadata';

import express, { Router } from 'express';
import { MikroORM } from '@mikro-orm/postgresql';
import { RequestContext } from '@mikro-orm/core';
import * as dotenv from 'dotenv';
import config from '../mikro-orm.config';
import { updateCartSchema } from './validations/product.validation';
import { ERROR_MESSAGES } from './constants';

import {
  ProductController, CartController, OrderController, UserController,
} from './controllers';
import {
  verifyToken, validateSchema, loggerMiddleware, verifyRole,
} from './middlewares';
import { shutdown, logger, healthCheck } from './helpers';

dotenv.config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  // Initialize MikroORM
  const orm = await MikroORM.init(config);
  logger.info('Connected to PostgreSQL database via MikroORM');

  const app = express();
  const router = Router();
  app.use(express.json());

  // Health check route
  app.get('/api/health', healthCheck(orm));
  // Log all requests
  app.use(loggerMiddleware);

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
  router.delete('/api/profile/cart', verifyRole, CartController.deleteCart);

  // Order routes
  router.post('/api/profile/cart/checkout', OrderController.createOrder);

  app.use(router);

  // 404 Route handler
  app.all('*', (req, res) => {
    res.status(404).json({ message: ERROR_MESSAGES[404].PRODUCT_NOT_FOUND });
  });

  const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => shutdown(server, orm));
  process.on('SIGTERM', () => shutdown(server, orm));
}

startServer().catch((error) => {
  logger.error('Error starting server:', error);
});
