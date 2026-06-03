// =============================================
// FILE: db/schema.ts
// Isme users table update karo (password column add)
// Agar already hai toh sirf 'password' column check karo
// =============================================

import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hash
  role: varchar("role", { length: 20 }).notNull().default("user"), // "admin" ya "user"
  createdAt: timestamp("created_at").defaultNow(),
});

// Agar aur bhi tables hain tero project mein, woh waise hi rakhna
// Bas yeh users table update/replace karna hai
