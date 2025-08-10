import 'reflect-metadata';

import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
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
  authenticateRequest, validateSchema, loggerMiddleware, authorizeRequest,
} from './middlewares';
import { shutdown, logger, healthCheck } from './helpers';

dotenv.config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  // Initialize MikroORM
  const orm = await MikroORM.init(config);
  logger.info('Connected to PostgreSQL database via MikroORM');

  const app = express();
  // Allow CORS for all domains (UNSAFE in production)
  app.use(
    cors({
      origin: 'http://localhost:3000', // ✅ Allow frontend to receive cookies
      credentials: true, // ✅ Allow sending and receiving cookies
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, 'static')));
  const router = Router();

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
  router.post('/api/auth/logout', UserController.logoutUser);

  // Product routes
  router.get('/api/products', ProductController.getAllProducts);
  router.get('/api/products/:productId', authenticateRequest, ProductController.getProductById);

  // // Cart routes
  router.get('/api/profile/cart', authenticateRequest, authorizeRequest, CartController.getCart);
  router.put('/api/profile/cart', authenticateRequest, authorizeRequest, validateSchema(updateCartSchema), CartController.updateCart);
  router.delete('/api/profile/cart', authenticateRequest, authorizeRequest, CartController.deleteCart);

  // Order routes
  router.post('/api/profile/cart/checkout', authenticateRequest, authorizeRequest, OrderController.createOrder);

  app.use(router);

  // 404 Route handler
  app.all('*', (req, res) => {
    res.status(404).json({
      message: ERROR_MESSAGES[404].ROUTE_NOT_FOUND,
      path: req.path,
      method: req.method,
    });
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
