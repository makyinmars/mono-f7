import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    // Add server-only vars here as needed
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
