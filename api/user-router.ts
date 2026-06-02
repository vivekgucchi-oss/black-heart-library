import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, adminQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, kObjects, purchases, messages, chatHistory, creatorStats, userXp } from "@db/schema";

export const userRouter = createRouter({
  // ─── Admin: List All Users ───
  list: adminQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = input || { limit: 50, offset: 0, search: undefined };

      const items = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users);

      return {
        items,
        total: countResult[0]?.count || 0,
      };
    }),

  // ─── Admin: Get User by ID ───
  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  // ─── Admin: Update User Role ───
  updateRole: adminQuery
    .input(
      z.object({
        id: z.number(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.id));
      return { success: true };
    }),

  // ─── Admin: Get Dashboard Stats ───
  stats: adminQuery.query(async () => {
    const db = getDb();

    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalKObjects = await db.select({ count: sql<number>`count(*)` }).from(kObjects);
    const totalPurchases = await db.select({ count: sql<number>`count(*)` }).from(purchases);
    const totalMessages = await db.select({ count: sql<number>`count(*)` }).from(messages);
    const unreadMessages = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.status, "unread"));
    const totalChatMessages = await db.select({ count: sql<number>`count(*)` }).from(chatHistory);

    // Revenue
    const revenue = await db
      .select({ total: sql<string>`COALESCE(SUM(${purchases.amount}), 0)` })
      .from(purchases)
      .where(eq(purchases.status, "completed"));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      totalKObjects: totalKObjects[0]?.count || 0,
      totalPurchases: totalPurchases[0]?.count || 0,
      totalMessages: totalMessages[0]?.count || 0,
      unreadMessages: unreadMessages[0]?.count || 0,
      totalChatMessages: totalChatMessages[0]?.count || 0,
      totalRevenue: revenue[0]?.total || "0",
    };
  }),

  // ─── Authenticated: Get My Profile ───
  myProfile: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = ctx.user;

    // Get creator stats
    const stats = await db
      .select()
      .from(creatorStats)
      .where(eq(creatorStats.userId, user.id))
      .limit(1);

    // Get XP
    const xp = await db
      .select()
      .from(userXp)
      .where(eq(userXp.userId, user.id))
      .limit(1);

    // Get counts
    const kObjectCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(kObjects)
      .where(eq(kObjects.creatorId, user.id));

    const purchaseCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(purchases)
      .where(eq(purchases.userId, user.id));

    return {
      user,
      creatorStats: stats[0] || null,
      xp: xp[0] || null,
      kObjectCount: kObjectCount[0]?.count || 0,
      purchaseCount: purchaseCount[0]?.count || 0,
    };
  }),
});
