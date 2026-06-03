// =============================================
// FILE: api/auth.ts
// Purana auth.ts DELETE karo, yeh paste karo
// =============================================

import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export const authRouter = Router();

// ── Helper: session store (in-memory, simple) ──
// Production mein Redis use karo, abhi ke liye yeh theek hai
const sessions: Record<string, { userId: number; role: string; expiresAt: number }> = {};

function createSession(userId: number, role: string): string {
  const token = randomBytes(32).toString("hex");
  sessions[token] = {
    userId,
    role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 din
  };
  return token;
}

export function getSession(token: string) {
  const session = sessions[token];
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    delete sessions[token];
    return null;
  }
  return session;
}

// ── Middleware: login check ──
export function requireAuth(req: Request, res: Response, next: Function) {
  const token = req.cookies?.session_token;
  if (!token) return res.status(401).json({ error: "Login karo pehle" });
  const session = getSession(token);
  if (!session) return res.status(401).json({ error: "Session expire ho gaya, dobara login karo" });
  (req as any).user = session;
  next();
}

export function requireAdmin(req: Request, res: Response, next: Function) {
  requireAuth(req, res, () => {
    if ((req as any).user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access chahiye" });
    }
    next();
  });
}

// ── POST /api/auth/register ──
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Naam, email aur password sab chahiye" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password kam se kam 6 characters ka hona chahiye" });
    }

    // Check karo email already hai kya
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Yeh email already registered hai" });
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // Pehla user = admin
    const allUsers = await db.select().from(users).limit(1);
    const role = allUsers.length === 0 ? "admin" : "user";

    const [newUser] = await db
      .insert(users)
      .values({ email, password: hashedPassword, name, role })
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

    const token = createSession(newUser.id, newUser.role);

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ── POST /api/auth/login ──
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email aur password chahiye" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({ error: "Email ya password galat hai" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ya password galat hai" });
    }

    const token = createSession(user.id, user.role);

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ── POST /api/auth/logout ──
authRouter.post("/logout", (req: Request, res: Response) => {
  const token = req.cookies?.session_token;
  if (token) delete sessions[token];
  res.clearCookie("session_token");
  return res.json({ ok: true });
});

// ── GET /api/auth/me ──
authRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return res.status(404).json({ error: "User nahi mila" });
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});
