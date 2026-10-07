import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { getCurrentUser, hashPassword, issueSession, verifyPassword } from "@/lib/session";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export async function POST(request: Request) {
  const account = await getCurrentUser();
  if (!account || account.isGuest || !account.passwordHash) {
    return Response.json({ error: "Sign in to a registered account to change its password." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  if (newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH) {
    return Response.json({ error: "The new password must be between 8 and 128 characters." }, { status: 400 });
  }
  if (!(await verifyPassword(currentPassword, account.passwordHash))) {
    return Response.json({ error: "Your current password is incorrect." }, { status: 401 });
  }
  if (currentPassword === newPassword) {
    return Response.json({ error: "Choose a password you have not used for this account." }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash }).where(eq(users.id, account.id));
  // Invalidate any other sessions created before the password change, then issue a fresh one.
  await db.delete(sessions).where(eq(sessions.userId, account.id));
  await issueSession(account.id);

  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
