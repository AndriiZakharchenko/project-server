import pool from '../../pg-pool.config';
import { products } from '../data/products';
import { users } from '../data/users';
import { logger } from '../helpers';

const seedDatabase = async () => {
  try {
    // Create the `users` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        email TEXT NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Create the `carts` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id UUID PRIMARY KEY,
        total INT NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create the `products` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        imageUrl TEXT,
        price INT NOT NULL
      );
    `);

    // Create the `cart_items` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id UUID PRIMARY KEY,
        count INT NOT NULL,
        cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // Insert users into the `users` table
    const userPromises = users.map((user) => pool.query(
      `
      INSERT INTO users (id, role, email, password)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING;
    `,
      [user.id, user.role, user.email, user.password],
    ));
    await Promise.all(userPromises);

    // Insert products into the `products` table
    const productPromises = products.map((product) => pool.query(
      `
        INSERT INTO products (id, title, description, price, imageUrl)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING;
      `,
      [product.id, product.title, product.description, product.price, product.imageUrl],
    ));
    await Promise.all(productPromises);

    logger.info('База даних успішно заповнена!');
  } catch (error) {
    logger.error('Помилка під час заповнення бази даних:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase().then(() => {});
