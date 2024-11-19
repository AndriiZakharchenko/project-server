import { Pool, PoolConfig } from 'pg';

const dbConfig: PoolConfig = {
  host: 'localhost',
  port: 5432,
  user: 'node_gmp',
  password: 'password123',
  database: 'node_gmp',
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(dbConfig);

export default pool;
