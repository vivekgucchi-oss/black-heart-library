import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatHistory } from "@db/schema";

export const chatRouter = createRouter({
  // ─── Public: Send message and get AI response ───
  send: publicQuery
    .input(
      z.object({
        message: z.string().min(1).max(2000),
        sessionId: z.string().min(1),
        kObjectId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id || null;

      // Save user message
      await db.insert(chatHistory).values({
        userId,
        sessionId: input.sessionId,
        role: "user",
        message: input.message,
        kObjectId: input.kObjectId || null,
      });

      // AI Response Simulation
      const responses = [
        "Fascinating question. Based on my analysis of the knowledge repository, I can share that this area has been explored by several key thinkers. The primary insight revolves around the intersection of cognitive frameworks and empirical evidence. Would you like me to elaborate on a specific aspect?",
        "From the scholarly records available, this topic connects to multiple disciplines. The consensus among researchers suggests a nuanced approach that balances theoretical foundations with practical applications. I recommend examining the related works I've indexed for you.",
        "This is a profound inquiry. The knowledge ecosystem indicates that recent research has shifted toward more interdisciplinary approaches. Several notable scholars have contributed groundbreaking insights that challenge traditional paradigms.",
        "Drawing from the repository, I can identify three key perspectives on this matter: the structuralist view, the empirical approach, and the emergent synthesis framework. Each offers unique insights that may help you develop a comprehensive understanding.",
        "The scholarly discourse around this topic is particularly rich. Based on citation patterns and trust scores of related works, I can guide you toward the most impactful research. Would you prefer a historical overview or contemporary developments?",
      ];

      const aiResponse = responses[Math.floor(Math.random() * responses.length)];

      // Save AI response
      await db.insert(chatHistory).values({
        userId,
        sessionId: input.sessionId,
        role: "assistant",
        message: aiResponse,
        kObjectId: input.kObjectId || null,
      });

      return {
        response: aiResponse,
        sessionId: input.sessionId,
      };
    }),

  // ─── Public: Get Chat History ───
  history: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const messages = await db
        .select()
        .from(chatHistory)
        .where(eq(chatHistory.sessionId, input.sessionId))
        .orderBy(chatHistory.createdAt);

      return messages;
    }),

  // ─── Auth: Get User's Chat Sessions ───
  sessions: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const sessions = await db
      .selectDistinct({ sessionId: chatHistory.sessionId })
      .from(chatHistory)
      .where(eq(chatHistory.userId, ctx.user.id));

    return sessions.map((s) => s.sessionId);
  }),
});
