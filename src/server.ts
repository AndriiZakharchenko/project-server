import 'reflect-metadata';

import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { MikroORM } from '@mikro-orm/postgresql';
import { RequestContext } from '@mikro-orm/core';
import * as dotenv from 'dotenv';
import config from '../mikro-orm.config';
import swaggerSpecs from './config/swagger.config';
import { updateCartSchema } from './validations/product.validation';
import { ERROR_MESSAGES } from './constants';

import {
  ProductController, CartController, OrderController, UserController, TrackController,
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
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'],
    credentials: true, // Allow sending and receiving cookies
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.options('*', cors()); // Handle preflight requests
  app.use(cookieParser());
  app.use(express.json());
  app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    abortOnLimit: true,
    responseOnLimit: 'File too large. Max size is 50MB.',
  }));
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

  // API Root route
  app.get('/', (req, res) => {
    res.json({
      name: 'Your App API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
      },
      documentation: '/api/docs',
      timestamp: new Date().toISOString(),
    });
  });

  // API root route
  app.get('/api', (req, res) => {
    res.json({
      message: 'Welcome to Your App API',
      version: '1.0.0',
      endpoints: '/api/docs',
      health: '/api/health',
    });
  });

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Your App API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // User routes
  router.post('/api/auth/login', UserController.loginUser);
  router.post('/api/auth/register', UserController.registerUser);
  router.post('/api/auth/logout', UserController.logoutUser);
  router.get('/api/auth/check', authenticateRequest, UserController.check);

  // Product routes
  router.get('/api/products', ProductController.getAllProducts);
  router.get('/api/products/:productId', authenticateRequest, authorizeRequest, ProductController.getProductById);
  router.post('/api/products', authenticateRequest, authorizeRequest, ProductController.addProduct);

  // Track routes
  router.get('/api/tracks', TrackController.getTracks);
  router.post('/api/tracks', authenticateRequest, authorizeRequest, TrackController.addTrack);

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
  console.error('Error starting server:', error);
  logger.error('Error starting server:', error);
});
