import 'reflect-metadata';
import express, { Router } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import pool from '../pg-pool.config';
import { ERROR_MESSAGES } from './constants';
import { ProductController } from './controllers/product.controller';

// import config from '../mikro-orm.config';
// import { validateSchema } from './middlewares/validate.middleware';
// import { validateUser } from './middlewares/user.middleware';
// import { updateCartSchema } from './validations/product.validation';
// import { CartController } from './controllers/cart.controller';
// import { OrderController } from './controllers/order.controller';

pool
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });

const PORT = process.env.PORT || 8000;

const app = express();
const router = Router();

// @ts-ignore
// const orm = await MikroORM.init(config);

app.use(express.json());

// app.use((req, res, next) => {
//   RequestContext.create(orm.em, next);
// });

// Product routes
router.get('/api/products', ProductController.getAllProducts);
// router.get('/api/products/:productId', ProductController.getProductById);
//
// // Cart routes
// router.get('/api/profile/cart', validateUser, CartController.getCart);
// router.put('/api/profile/cart', validateUser, validateSchema(updateCartSchema), CartController.updateCart);
// router.delete('/api/profile/cart', validateUser, CartController.deleteCart);
//
// // Order routes
// router.post('/api/profile/cart/checkout', validateUser, OrderController.createOrder);

app.use(router);

// 404 Route handler
app.all('*', (req, res) => {
  res.status(404).json({ message: ERROR_MESSAGES[404].NOT_FOUND });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
