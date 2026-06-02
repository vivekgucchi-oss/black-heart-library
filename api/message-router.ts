import { z } from "zod";
import { eq, desc, sql, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { messages } from "@db/schema";

export const messageRouter = createRouter({
  // ─── Public: Submit Contact Message ───
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(messages).values(input);
      return { id: Number(result[0].insertId), success: true };
    }),

  // ─── Admin: List All Messages ───
  list: adminQuery
    .input(
      z.object({
        status: z.enum(["unread", "read", "resolved"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = input || {
        status: undefined,
        limit: 50,
        offset: 0,
      };

      const conditions = [];

      if (filters.status) {
        conditions.push(eq(messages.status, filters.status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(messages)
        .where(whereClause)
        .orderBy(desc(messages.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(whereClause);

      return {
        items,
        total: countResult[0]?.count || 0,
      };
    }),

  // ─── Admin: Get Single Message ───
  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  // ─── Admin: Mark as Read ───
  markRead: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(messages)
        .set({ status: "read" })
        .where(eq(messages.id, input.id));
      return { success: true };
    }),

  // ─── Admin: Mark as Resolved ───
  resolve: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(messages)
        .set({ status: "resolved" })
        .where(eq(messages.id, input.id));
      return { success: true };
    }),

  // ─── Admin: Delete Message ───
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(messages).where(eq(messages.id, input.id));
      return { success: true };
    }),

  // ─── Admin: Get Stats ───
  stats: adminQuery.query(async () => {
    const db = getDb();
    const total = await db.select({ count: sql<number>`count(*)` }).from(messages);
    const unread = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.status, "unread"));
    const read = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.status, "read"));
    const resolved = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.status, "resolved"));

    return {
      total: total[0]?.count || 0,
      unread: unread[0]?.count || 0,
      read: read[0]?.count || 0,
      resolved: resolved[0]?.count || 0,
    };
  }),
});

