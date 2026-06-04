// =============================================
// FILE: api/lib/db.ts  (NAYA FILE BANAO)
// =============================================

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "./env";

const connection = await mysql.createConnection(env.databaseUrl);
export const db = drizzle(connection);
