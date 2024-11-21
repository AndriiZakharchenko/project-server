import pool from '../../pg-pool.config';

const seedDatabase = async () => {
  try {
    // Create the `products` table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price INT NOT NULL
      );
    `);

    // Insert initial product data
    const products = [
      {
        id: '51422fcd-0366-4186-ad5b-c23059b6f64f',
        title: 'Book',
        description: 'A very interesting book',
        price: 100,
      },
      {
        id: 'c28e1102-a952-4c8e-92f7-e2c34d30af95',
        title: 'Dress',
        description: 'Nice and beautiful',
        price: 300,
      },
      {
        id: '545ff714-5097-4493-b5df-84c96c187343',
        title: 'Toy',
        description: 'Teddy bear',
        price: 50,
      },
    ];

    // Prepare insert promises for each product
    const insertPromises = products.map((product) => pool.query(
      `
        INSERT INTO products (id, title, description, price)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `,
      [product.id, product.title, product.description, product.price],
    ));

    // Execute all insertions concurrently
    await Promise.all(insertPromises);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase().then(() => {});
