import { createMiddleware } from '@tanstack/react-start';

const preLogMiddleware = createMiddleware({ type: 'function' })
  .client((ctx) => {
    const clientTime = new Date();

    return ctx.next({
      context: {
        clientTime,
      },
      sendContext: {
        clientTime,
      },
    });
  })
  .server((ctx) => {
    const serverTime = new Date();

    return ctx.next({
      sendContext: {
        serverTime,
        durationToServer:
          serverTime.getTime() - ctx.context.clientTime.getTime(),
      },
    });
  });

export const logMiddleware = createMiddleware({ type: 'function' })
  .middleware([preLogMiddleware])
  .client(async (ctx) => {
    const res = await ctx.next();

    const _now = new Date();

    return res;
  });
