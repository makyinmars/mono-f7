import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '../index';

export type RouterOutput = inferRouterOutputs<AppRouter>;
