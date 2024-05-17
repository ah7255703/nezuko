import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { env } from "../env.js";
import * as schema from './schema';

export const conn = new Client({
    connectionString: env.PG_DB_URL,
});

(async () => {
    await conn.connect();
})();

export const db = drizzle(conn, {
    schema: schema,
});
