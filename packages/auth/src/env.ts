import { z } from "zod";

export const envSchema = z.object({
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  PUBLIC_URL_STORE: z.string().url(),
  PUBLIC_URL_ADMIN: z.string().url(),
  AUTH_COOKIE_DOMAIN: z.string().optional().default(""),
});

export const env = envSchema.parse(process.env);
