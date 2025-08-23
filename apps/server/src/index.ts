import { trpcServer } from '@hono/trpc-server';
import { createApi } from '@repo/api/server';
import { createAuth } from '@repo/auth/server';
import { createDb } from '@repo/db/client';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './env';

// Build trusted origins from both app URLs
const trustedOrigins = [
  new URL(env.PUBLIC_URL_STORE).origin,
  new URL(env.PUBLIC_URL_ADMIN).origin,
];

const wildcardPath = {
  ALL: '*',
  BETTER_AUTH: '/api/auth/*',
  TRPC: '/api/trpc/*',
} as const;

const db = createDb({ databaseUrl: env.DATABASE_URL });
const auth = createAuth({
  authSecret: env.SERVER_AUTH_SECRET,
  db,
  storeUrl: env.PUBLIC_URL_STORE,
  adminUrl: env.PUBLIC_URL_ADMIN,
  cookieDomain: env.AUTH_COOKIE_DOMAIN,
});
const api = createApi({ auth, db });

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.get('/healthcheck', (c) => {
  return c.text('OK');
});

app.use(logger());

app.use(
  wildcardPath.BETTER_AUTH,
  cors({
    origin: trustedOrigins,
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  })
);

app.use(
  wildcardPath.TRPC,
  cors({
    origin: trustedOrigins,
    credentials: true,
  })
);

app.on(['POST', 'GET'], wildcardPath.BETTER_AUTH, (c) =>
  auth.handler(c.req.raw)
);

app.use(
  wildcardPath.TRPC,
  trpcServer({
    endpoint: '/api/trpc',
    router: api.trpcRouter,
    createContext: (c) => api.createTRPCContext({ headers: c.req.headers }),
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default {
  port: env.SERVER_PORT,
  hostname: env.SERVER_HOST,
  fetch: app.fetch,
};
