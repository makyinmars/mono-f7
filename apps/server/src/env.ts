import { z } from 'zod';

const DEFAULT_SERVER_PORT = 3035;
const DEFAULT_SERVER_HOST = 'localhost';

const createPortSchema = ({ defaultPort }: { defaultPort: number }) =>
  z
    .string()
    .default(`${defaultPort}`)
    .transform((s) => Number.parseInt(s, 10))
    .refine((n) => Number.isInteger(n), { message: 'Must be an integer' })
    .refine((n) => n >= 0 && n <= 65_535, {
      message: 'Port must be between 0 and 65535',
    });

export const envSchema = z.object({
  SERVER_PORT: createPortSchema({ defaultPort: DEFAULT_SERVER_PORT }),
  SERVER_HOST: z.string().min(1).default(DEFAULT_SERVER_HOST),
  SERVER_AUTH_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  // Multiple frontend URLs for store and admin apps
  PUBLIC_URL_STORE: z.string().url(),
  PUBLIC_URL_ADMIN: z.string().url(),

  // Optional cookie domain for subdomain sharing
  AUTH_COOKIE_DOMAIN: z.string().optional().default(''),
});

export const env = envSchema.parse(process.env);
