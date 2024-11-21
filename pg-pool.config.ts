import { Pool, PoolConfig } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'node_gmp',
  password: 'password123',
  database: 'node_gmp',
  max: 10,
  idleTimeoutMillis: 30000,
} as PoolConfig);

export default pool;
