import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const rawUrl = process.env.DATABASE_URL;
const connectionString = rawUrl?.startsWith("psql '") 
  ? rawUrl.replace(/^psql\s+'(.*)'$/, '$1')
  : rawUrl;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
