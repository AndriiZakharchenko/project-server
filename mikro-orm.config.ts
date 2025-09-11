import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  entities: ['./dist/src/entities/**/*.entity.js'],
  entitiesTs: ['./src/entities/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  clientUrl: process.env.DATABASE_URL,
  driverOptions: { connection: { ssl: { rejectUnauthorized: false } } },
  migrations: { path: './src/migrations', tableName: 'migrations', transactional: true },
});

// export default defineConfig({
//   dbName: process.env.DB_NAME || 'node_gmp',
//   entities: ['./dist/entities/**/*.entity.js'],
//   entitiesTs: ['./src/entities/**/*.entity.ts'],
//   metadataProvider: TsMorphMetadataProvider,
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 5432,
//   user: process.env.DB_USER || 'node_gmp',
//   password: process.env.DB_PASSWORD || 'password123',
// });
