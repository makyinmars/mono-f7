import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { env } from "./env";
import * as schema from "./schema";

export type DatabaseInstance = NodePgDatabase<typeof schema>;

export const db = drizzle({
  schema,
  casing: "snake_case",
  connection: {
    connectionString: env.DATABASE_URL,
  },
});

export { schema };
