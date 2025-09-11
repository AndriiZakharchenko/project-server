import { defineConfig } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';

import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ReflectMetadataProvider } from '@mikro-orm/core';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  entities: isProd
    ? ['./dist/src/entities/**/*.entity.js']
    : ['./src/entities/**/*.entity.ts'],
  ...(isProd ? {} : { entitiesTs: ['./src/entities/**/*.entity.ts'] }),
  metadataProvider: isProd ? ReflectMetadataProvider : TsMorphMetadataProvider,

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
