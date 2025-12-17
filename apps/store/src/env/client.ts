import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const DEFAULT_API_URL = "http://localhost:3035";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url().default(DEFAULT_API_URL),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
