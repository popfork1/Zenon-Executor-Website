// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_1Marh0qtUWKj@ep-misty-frost-ai4z5htp-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
