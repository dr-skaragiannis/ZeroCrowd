import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { clearSession, createGuestSession, getCurrentUser, hashPassword, issueSession, verifyPassword } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || "");

    if (action === "logout") {
      await clearSession();
      return Response.json({ ok: true });
    }

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (action === "register") {
      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing.length) return Response.json({ error: "An account with that email already exists." }, { status: 409 });
      let player = await getCurrentUser();
      if (!player) player = await createGuestSession();
      if (!player.isGuest) return Response.json({ error: "You are already signed in. Sign out before creating another account." }, { status: 400 });
      const displayName = String(body.displayName || "").trim().replace(/\s+/g, " ").slice(0, 60);
      if (displayName.length < 2) return Response.json({ error: "Enter a name with at least 2 characters." }, { status: 400 });
      const handle = `${displayName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 20) || "operator"}_${randomBytes(2).toString("hex")}`;
      await db.update(users).set({ displayName, handle, email, passwordHash: await hashPassword(password), isGuest: false }).where(eq(users.id, player.id));
      return Response.json({ ok: true });
    }

    if (action === "login") {
      const [account] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!account?.passwordHash || !(await verifyPassword(password, account.passwordHash))) {
        return Response.json({ error: "Incorrect email or password." }, { status: 401 });
      }
      await clearSession();
      await issueSession(account.id);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return Response.json({ error: "Unable to complete that request. Please try again." }, { status: 500 });
  }
}
