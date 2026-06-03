# KYA KARNA HAI — Step by Step

## Step 1 — GitHub pe 3 files replace karo

| Yeh file download karo | GitHub pe yahan paste karo |
|---|---|
| auth-router.ts | api/kimi/auth.ts (purana DELETE karke yeh paste karo) |
| boot.ts | api/boot.ts (purana DELETE karke yeh paste karo) |
| schema.ts | db/schema.ts mein sirf users table wala part replace karo |

## Step 2 — package.json mein bcryptjs add karo

GitHub pe package.json kholo → "dependencies" mein yeh line add karo:

  "bcryptjs": "^2.4.3",

(jose aur cookie already hain ✅)

## Step 3 — Railway mein Environment Variables

Sirf yeh 2 rakhne hain:
  DATABASE_URL = tera mysql url (already hai ✅)
  APP_SECRET   = koi bhi random string likho (jaise: meri-library-secret-2024)

NODE_ENV = production (yeh bhi add karo agar nahi hai)

## Step 4 — Railway mein Start Command set karo

Service → Settings → Deploy → Start Command:
  npm run db:push && npm start

## Step 5 — Redeploy karo

Railway → Deployments → Redeploy

## Step 6 — Test karo

/api/auth/register pe POST karo ya frontend se register karo
Pehla register karne wala = ADMIN ban jaega!
