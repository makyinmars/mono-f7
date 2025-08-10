import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  casing: 'snake_case',
});
