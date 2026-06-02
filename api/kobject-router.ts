import { z } from "zod";
import { eq, desc, sql, and, like, or } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { kObjects, purchases, creatorStats, userXp } from "@db/schema";

export const kobjectRouter = createRouter({
  // ─── Public: List K-Objects ───
  list: publicQuery
    .input(
      z.object({
        type: z.string().optional(),
        category: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["newest", "popular", "trust", "price_asc", "price_desc"]).default("newest"),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = input || {
        type: undefined,
        category: undefined,
        search: undefined,
        sortBy: "newest" as const,
        limit: 20,
        offset: 0,
      };
      const conditions = [];

      conditions.push(eq(kObjects.status, "published"));

      if (filters.type) {
        conditions.push(eq(kObjects.type, filters.type as any));
      }
      if (filters.category) {
        conditions.push(eq(kObjects.category, filters.category));
      }
      if (filters.search) {
        conditions.push(
          or(
            like(kObjects.title, `%${filters.search}%`),
            like(kObjects.description, `%${filters.search}%`),
            like(kObjects.tags, `%${filters.search}%`)
          )
        );
      }

      let orderBy: any = desc(kObjects.createdAt);
      if (filters.sortBy === "popular") orderBy = desc(kObjects.popularityScore);
      if (filters.sortBy === "trust") orderBy = desc(kObjects.trustScore);
      if (filters.sortBy === "price_asc") orderBy = sql`${kObjects.price} ASC`;
      if (filters.sortBy === "price_desc") orderBy = sql`${kObjects.price} DESC`;

      const items = await db
        .select()
        .from(kObjects)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(filters.limit || 20)
        .offset(filters.offset || 0);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(kObjects)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        items,
        total: countResult[0]?.count || 0,
      };
    }),

  // ─── Public: Get Single K-Object ───
  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(kObjects)
        .where(eq(kObjects.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  // ─── Public: Get Trending ───
  trending: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(kObjects)
      .where(eq(kObjects.status, "published"))
      .orderBy(desc(kObjects.popularityScore))
      .limit(8);
  }),

  // ─── Public: Get Categories ───
  categories: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ category: kObjects.category })
      .from(kObjects)
      .where(eq(kObjects.status, "published"))
      .groupBy(kObjects.category);
    return result.map((r) => r.category);
  }),

  // ─── Authenticated: Create K-Object ───
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        subtitle: z.string().max(255).optional(),
        description: z.string().optional(),
        type: z.enum(["BOOK", "PDF", "PAPER", "RESEARCH", "THEORY", "FRAMEWORK", "NOTE"]),
        category: z.string().min(1).max(100),
        tags: z.string().optional(),
        language: z.string().default("English"),
        coverImage: z.string().optional(),
        contentUrl: z.string().optional(),
        authorName: z.string().max(255).optional(),
        publicationYear: z.number().optional(),
        price: z.string().default("0"),
        isFree: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const result = await db.insert(kObjects).values({
        ...input,
        creatorId: userId,
        status: "published",
        currency: "ETH",
        trustScore: "0.50",
        originalityScore: "0.50",
        engagementScore: "0.50",
        popularityScore: "0.50",
      });

      // Update creator stats
      await db
        .insert(creatorStats)
        .values({
          userId,
          totalWorks: 1,
          creatorLevel: "Explorer",
        })
        .onDuplicateKeyUpdate({
          set: {
            totalWorks: sql`${creatorStats.totalWorks} + 1`,
          },
        });

      // Update creator XP
      await db
        .insert(userXp)
        .values({
          userId,
          creatorXp: 50,
          xp: 50,
        })
        .onDuplicateKeyUpdate({
          set: {
            creatorXp: sql`${userXp.creatorXp} + 50`,
            xp: sql`${userXp.xp} + 50`,
          },
        });

      return { id: Number(result[0].insertId), success: true };
    }),

  // ─── Authenticated: Update K-Object ───
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        subtitle: z.string().max(255).optional(),
        description: z.string().optional(),
        category: z.string().max(100).optional(),
        tags: z.string().optional(),
        coverImage: z.string().optional(),
        contentUrl: z.string().optional(),
        price: z.string().optional(),
        status: z.enum(["draft", "published", "under_review", "rejected"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...data } = input;

      // Verify ownership
      const existing = await db
        .select()
        .from(kObjects)
        .where(eq(kObjects.id, id))
        .limit(1);

      if (!existing[0]) throw new Error("K-Object not found");
      if (existing[0].creatorId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Not authorized");
      }

      await db.update(kObjects).set(data).where(eq(kObjects.id, id));
      return { success: true };
    }),

  // ─── Authenticated: Delete K-Object ───
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(kObjects)
        .where(eq(kObjects.id, input.id))
        .limit(1);

      if (!existing[0]) throw new Error("K-Object not found");
      if (existing[0].creatorId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Not authorized");
      }

      await db.delete(kObjects).where(eq(kObjects.id, input.id));
      return { success: true };
    }),

  // ─── Authenticated: Purchase K-Object ───
  purchase: authedQuery
    .input(z.object({ kObjectId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const item = await db
        .select()
        .from(kObjects)
        .where(eq(kObjects.id, input.kObjectId))
        .limit(1);

      if (!item[0]) throw new Error("K-Object not found");

      // Check if already purchased
      const existing = await db
        .select()
        .from(purchases)
        .where(
          and(
            eq(purchases.userId, userId),
            eq(purchases.kObjectId, input.kObjectId)
          )
        )
        .limit(1);

      if (existing[0]) return { alreadyPurchased: true };

      // Record purchase
      await db.insert(purchases).values({
        userId,
        kObjectId: input.kObjectId,
        amount: item[0].price,
        currency: item[0].currency,
        status: "completed",
      });

      // Update popularity score
      await db
        .update(kObjects)
        .set({
          popularityScore: sql`LEAST(1.00, ${kObjects.popularityScore} + 0.05)`,
          engagementScore: sql`LEAST(1.00, ${kObjects.engagementScore} + 0.03)`,
        })
        .where(eq(kObjects.id, input.kObjectId));

      return { success: true, alreadyPurchased: false };
    }),

  // ─── Authenticated: Check Purchase ───
  checkPurchase: authedQuery
    .input(z.object({ kObjectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(purchases)
        .where(
          and(
            eq(purchases.userId, ctx.user.id),
            eq(purchases.kObjectId, input.kObjectId)
          )
        )
        .limit(1);
      return !!result[0];
    }),

  // ─── Authenticated: My Library (Purchased Items) ───
  myLibrary: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const purchased = await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, ctx.user.id));

    if (purchased.length === 0) return [];

    const kObjectIds = purchased.map((p) => p.kObjectId);
    const items = await db
      .select()
      .from(kObjects)
      .where(sql`${kObjects.id} IN (${kObjectIds.join(",")})`);

    return items;
  }),

  // ─── Authenticated: My Creations ───
  myCreations: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(kObjects)
      .where(eq(kObjects.creatorId, ctx.user.id))
      .orderBy(desc(kObjects.createdAt));
  }),

  // ─── Admin: All K-Objects ───
  adminList: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(kObjects).orderBy(desc(kObjects.createdAt));
  }),

  // ─── Admin: Moderate K-Object ───
  moderate: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "published", "under_review", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(kObjects).set({ status: input.status }).where(eq(kObjects.id, input.id));
      return { success: true };
    }),
});
