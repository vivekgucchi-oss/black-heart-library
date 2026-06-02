import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (OAuth managed) ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Knowledge Objects (K-Objects) ───
export const kObjects = mysqlTable("k_objects", {
  id: serial("id").primaryKey(),
  creatorId: bigint("creator_id", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"),
  type: mysqlEnum("type", ["BOOK", "PDF", "PAPER", "RESEARCH", "THEORY", "FRAMEWORK", "NOTE"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags"), // comma-separated tags
  language: varchar("language", { length: 50 }).default("English"),
  coverImage: text("cover_image"),
  contentUrl: text("content_url"),
  authorName: varchar("author_name", { length: 255 }),
  publicationYear: int("publication_year"),
  price: decimal("price", { precision: 10, scale: 4 }).default("0.0000").notNull(),
  currency: varchar("currency", { length: 10 }).default("ETH"),
  isFree: int("is_free").default(0).notNull(), // 0=paid, 1=free
  trustScore: decimal("trust_score", { precision: 3, scale: 2 }).default("0.00"),
  originalityScore: decimal("originality_score", { precision: 3, scale: 2 }).default("0.00"),
  engagementScore: decimal("engagement_score", { precision: 3, scale: 2 }).default("0.00"),
  popularityScore: decimal("popularity_score", { precision: 3, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["draft", "published", "under_review", "rejected"]).default("draft").notNull(),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type KObject = typeof kObjects.$inferSelect;
export type InsertKObject = typeof kObjects.$inferInsert;

// ─── Purchases ───
export const purchases = mysqlTable("purchases", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  kObjectId: bigint("k_object_id", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("ETH"),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;

// ─── Messages (Contact System) ───
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["unread", "read", "resolved"]).default("unread").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;

// ─── AI Chat History ───
export const chatHistory = mysqlTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  message: text("message").notNull(),
  kObjectId: bigint("k_object_id", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatMessage = typeof chatHistory.$inferSelect;

// ─── Reviews ───
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  kObjectId: bigint("k_object_id", { mode: "number", unsigned: true }).notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;

// ─── Collections (Reading Lists) ───
export const collections = mysqlTable("collections", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: int("is_public").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Collection Items ───
export const collectionItems = mysqlTable("collection_items", {
  id: serial("id").primaryKey(),
  collectionId: bigint("collection_id", { mode: "number", unsigned: true }).notNull(),
  kObjectId: bigint("k_object_id", { mode: "number", unsigned: true }).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// ─── Creator Stats ───
export const creatorStats = mysqlTable("creator_stats", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().unique(),
  totalWorks: int("total_works").default(0).notNull(),
  totalSales: int("total_sales").default(0).notNull(),
  totalViews: int("total_views").default(0).notNull(),
  totalDownloads: int("total_downloads").default(0).notNull(),
  totalFollowers: int("total_followers").default(0).notNull(),
  revenue: decimal("revenue", { precision: 16, scale: 8 }).default("0.00000000"),
  creatorLevel: mysqlEnum("creator_level", ["Explorer", "Contributor", "Researcher", "Verified Creator", "Master Creator", "Legend"]).default("Explorer").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type CreatorStat = typeof creatorStats.$inferSelect;

// ─── User XP / Gamification ───
export const userXp = mysqlTable("user_xp", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().unique(),
  xp: int("xp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  readingXp: int("reading_xp").default(0).notNull(),
  creatorXp: int("creator_xp").default(0).notNull(),
  badges: text("badges"), // comma-separated badge IDs
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type UserXp = typeof userXp.$inferSelect;
