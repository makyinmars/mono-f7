import { z } from 'zod';

const DEFAULT_API_URL = 'http://localhost:3035';

export const envSchema = z.object({
  PUBLIC_API_URL: z.string().url().default(DEFAULT_API_URL),
});

export const env = envSchema.parse({
  PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL,
});