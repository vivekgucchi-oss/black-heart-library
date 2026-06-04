// =============================================
// FILE: api/schema.ts  (REPLACE karo)
// =============================================

import { mysqlTable, int, varchar, timestamp, text } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull().default(""),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  unionId: varchar("union_id", { length: 255 }),
  avatar: text("avatar"),
  lastSignInAt: timestamp("last_sign_in_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
