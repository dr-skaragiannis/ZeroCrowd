import { createGuestSession, getCurrentUser } from "@/lib/session";

export async function POST() {
  const existing = await getCurrentUser();
  if (existing) return Response.json({ ok: true, created: false });
  await createGuestSession();
  return Response.json({ ok: true, created: true });
}
