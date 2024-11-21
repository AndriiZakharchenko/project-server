import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  dbName: 'node_gmp',
  entities: ['./dist/entities/**/*.entity.js'],
  entitiesTs: ['./src/entities/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  host: 'localhost',
  port: 5432,
  user: 'node_gmp',
  password: 'password123',
  migrations: {
    path: './src/migrations',
    tableName: 'migrations',
    transactional: true,
  },
});
