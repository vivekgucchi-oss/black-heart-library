import { z } from "zod";
import { eq, desc, sql, and } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews } from "@db/schema";

export const reviewRouter = createRouter({
  // ─── Public: Get Reviews for a K-Object ───
  list: publicQuery
    .input(z.object({ kObjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(reviews)
        .where(eq(reviews.kObjectId, input.kObjectId))
        .orderBy(desc(reviews.createdAt));
    }),

  // ─── Public: Get Average Rating ───
  averageRating: publicQuery
    .input(z.object({ kObjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({ avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)` })
        .from(reviews)
        .where(eq(reviews.kObjectId, input.kObjectId));

      return { average: Math.round((result[0]?.avg || 0) * 10) / 10 };
    }),

  // ─── Authenticated: Create Review ───
  create: authedQuery
    .input(
      z.object({
        kObjectId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Check if already reviewed
      const existing = await db
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.userId, ctx.user.id),
            eq(reviews.kObjectId, input.kObjectId)
          )
        )
        .limit(1);

      if (existing[0]) {
        // Update existing review
        await db
          .update(reviews)
          .set({
            rating: input.rating,
            comment: input.comment || null,
          })
          .where(eq(reviews.id, existing[0].id));

        return { id: existing[0].id, updated: true };
      }

      const result = await db.insert(reviews).values({
        userId: ctx.user.id,
        kObjectId: input.kObjectId,
        rating: input.rating,
        comment: input.comment || null,
      });

      return { id: Number(result[0].insertId), updated: false };
    }),

  // ─── Authenticated: Delete Review ───
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(reviews)
        .where(eq(reviews.id, input.id))
        .limit(1);

      if (!existing[0]) throw new Error("Review not found");
      if (existing[0].userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Not authorized");
      }

      await db.delete(reviews).where(eq(reviews.id, input.id));
      return { success: true };
    }),
});
