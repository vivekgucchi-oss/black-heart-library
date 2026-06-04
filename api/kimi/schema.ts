// =============================================
// FILE: db/schema.ts
// Users table mein password aur role column add karo
// SIRF users table wala part replace karo
// Baaki tables waise hi rakhna
// =============================================

import { mysqlTable, int, varchar, timestamp, text } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull().default(""),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  // Purane Kimi columns — reh sakte hain, koi dikkat nahi
  unionId: varchar("union_id", { length: 255 }),
  avatar: text("avatar"),
  lastSignInAt: timestamp("last_sign_in_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
