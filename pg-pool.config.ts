import { Pool, PoolConfig } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
} as PoolConfig);

export default pool;

// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   user: 'node_gmp',
//   password: 'password123',
//   database: 'node_gmp',
//   max: 10,
//   idleTimeoutMillis: 30000,
// } as PoolConfig);
