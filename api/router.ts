import { authRouter } from "./auth-router";
import { kobjectRouter } from "./kobject-router";
import { messageRouter } from "./message-router";
import { chatRouter } from "./chat-router";
import { reviewRouter } from "./review-router";
import { userRouter } from "./user-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  kobject: kobjectRouter,
  message: messageRouter,
  chat: chatRouter,
  review: reviewRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
