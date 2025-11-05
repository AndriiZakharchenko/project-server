import pool from '../../pg-pool.config';
import { products } from '../data/products';
import { tracks } from '../data/tracks';
import { logger } from '../helpers';

const cleanDatabase = async () => {
  try {
    logger.info('Початок очищення бази даних...');

    const dropTables = [
      'DROP TABLE IF EXISTS cart_items CASCADE;',
      'DROP TABLE IF EXISTS carts CASCADE;',
      'DROP TABLE IF EXISTS tokens CASCADE;',
      'DROP TABLE IF EXISTS tracks CASCADE;',
      'DROP TABLE IF EXISTS products CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;',
    ];

    const dropPromises = dropTables.map((dropQuery) => {
      logger.info(`Видаляємо таблицю: ${dropQuery}`);
      return pool.query(dropQuery);
    });

    await Promise.all(dropPromises);

    logger.info('База даних повністю очищена!');
  } catch (error) {
    logger.error('Помилка під час очищення бази даних:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Create the `users` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        email TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        activation_link VARCHAR(255) NOT NULL,
        is_activated BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);

    // Create the `tokens` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        refresh_token TEXT NOT NULL UNIQUE
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
        image_url TEXT,
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

    // Create the `tracks` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tracks (
        id UUID PRIMARY KEY,
        artist VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        album VARCHAR(255),
        year INT,
        track_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert products into the `products` table
    const productPromises = products.map((product) => pool.query(
      `
        INSERT INTO products (id, title, description, price, image_url)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING;
      `,
      [product.id, product.title, product.description, product.price, product.image_url],
    ));
    await Promise.all(productPromises);

    // Insert tracks into the `tracks` table
    const trackPromises = tracks.map((track) => pool.query(
      `
        INSERT INTO tracks (id, artist, title, album, year, track_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING;
      `,
      [track.id, track.artist, track.title, track.album, track.year, track.track_url],
    ));
    await Promise.all(trackPromises);

    logger.info('База даних успішно заповнена!');
  } catch (error) {
    logger.error('Помилка під час заповнення бази даних:', error);
  }
};

const resetDatabase = async () => {
  try {
    await cleanDatabase();
    await seedDatabase();
    logger.info('База даних успішно перезавантажена!');
  } catch (error) {
    logger.error('Помилка під час перезавантаження бази даних:', error);
  } finally {
    await pool.end();
  }
};

// Запускаємо повне перезавантаження БД
resetDatabase().then(() => {
  process.exit(0);
});
