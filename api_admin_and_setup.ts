// =============================================
// FILE: api/admin.ts
// Admin routes — users list dekhna, role change karna
// =============================================

import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./auth";

export const adminRouter = Router();

// GET /api/admin/users — sabhi users ki list
adminRouter.get("/users", requireAdmin, async (req: Request, res: Response) => {
  try {
    const allUsers = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role })
      .from(users);
    return res.json({ users: allUsers });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/admin/users/:id/role — role change karo
adminRouter.patch("/users/:id/role", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Role sirf 'admin' ya 'user' ho sakta hai" });
    }

    await db.update(users).set({ role }).where(eq(users.id, userId));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});


// =============================================
// FILE: .env  (Railway mein environment variables mein yeh daalo)
// =============================================

/*
DATABASE_URL=mysql://user:password@host:port/dbname
APP_SECRET=koi-bhi-random-string-likho-jaise-abc123xyz
NODE_ENV=production
*/


// =============================================
// SERVER MAIN FILE mein yeh add karo (server.ts ya index.ts)
// =============================================

/*
import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./api/auth";
import { adminRouter } from "./api/admin";

const app = express();

app.use(express.json());
app.use(cookieParser());           // <-- ZAROORI hai cookies ke liye

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
*/


// =============================================
// PACKAGE.JSON mein yeh packages add karo agar nahi hain:
// npm install bcryptjs cookie-parser
// npm install --save-dev @types/bcryptjs @types/cookie-parser
// =============================================
