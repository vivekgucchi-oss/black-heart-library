// =============================================
// FILE: api/kimi/auth.ts
// Purana file REPLACE karo — Kimi hatao, simple login lagao
// =============================================

import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";

// ── Secret key JWT ke liye ──
const SECRET = new TextEncoder().encode(
  process.env.APP_SECRET || "default-secret-change-this-in-production"
);

// ── JWT token banao ──
async function signSessionToken(payload: { userId: number; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

// ── JWT token verify karo ──
async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: number; role: string };
  } catch {
    return null;
  }
}

// ── Har request mein session check karo (middleware) ──
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];

  if (!token) {
    console.warn("[auth] No session cookie found in request.");
    throw Errors.forbidden("Login karo pehle.");
  }

  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Session expire ho gaya, dobara login karo.");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, claim.userId))
    .limit(1);

  if (!user) {
    throw Errors.forbidden("User nahi mila, dobara login karo.");
  }

  return user;
}

// ── Register handler ──
export function createRegisterHandler() {
  return async (c: Context) => {
    try {
      const { email, password, name } = await c.req.json();

      if (!email || !password || !name) {
        return c.json({ error: "Naam, email aur password sab chahiye" }, 400);
      }

      if (password.length < 6) {
        return c.json({ error: "Password kam se kam 6 characters ka hona chahiye" }, 400);
      }

      // Email already registered?
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing.length > 0) {
        return c.json({ error: "Yeh email already registered hai" }, 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Pehla user = admin
      const allUsers = await db.select().from(users).limit(1);
      const role = allUsers.length === 0 ? "admin" : "user";

      const [newUser] = await db
        .insert(users)
        .values({ email, password: hashedPassword, name, role })
        .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

      const token = await signSessionToken({ userId: newUser.id, role: newUser.role });

      setCookie(c, Session.cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return c.json({ user: newUser });
    } catch (err) {
      console.error("Register error:", err);
      return c.json({ error: "Server error" }, 500);
    }
  };
}

// ── Login handler ──
export function createLoginHandler() {
  return async (c: Context) => {
    try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
        return c.json({ error: "Email aur password chahiye" }, 400);
      }

      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        return c.json({ error: "Email ya password galat hai" }, 401);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return c.json({ error: "Email ya password galat hai" }, 401);
      }

      const token = await signSessionToken({ userId: user.id, role: user.role });

      setCookie(c, Session.cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return c.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (err) {
      console.error("Login error:", err);
      return c.json({ error: "Server error" }, 500);
    }
  };
}

// ── Logout handler ──
export function createLogoutHandler() {
  return async (c: Context) => {
    setCookie(c, Session.cookieName, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return c.json({ ok: true });
  };
}

// Purana Kimi OAuth handler — ab kaam nahi karega, redirect karega
export function createOAuthCallbackHandler() {
  return async (c: Context) => {
    return c.redirect("/login", 302);
  };
}
