import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export type DatabaseClientOptions = {
  databaseUrl?: string;
  max?: number;
};

export type DatabaseInstance = NodePgDatabase<typeof schema>;

export const createDb = (opts?: DatabaseClientOptions): DatabaseInstance =>
  drizzle({
    schema,
    casing: "snake_case",
    connection: {
      connectionString: opts?.databaseUrl,
      max: opts?.max,
    },
  });
