import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ACCOUNT_KEY_FORMAT, type AccountRecoveryFile } from "@/lib/accountKey";
import { clearSession, getCurrentUser, hashPassword, issueSession, verifyPassword } from "@/lib/session";

const ACCOUNT_KEY_ACTIONS = new Set(["key-login", "recovery-key"]);
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function keyDigest(userId: string, key: string) {
  return createHash("sha256").update(`${userId}:${key}`).digest("hex");
}

function recoveryFileFor(account: { id: string; handle: string; displayName: string }, key: string): AccountRecoveryFile {
  return {
    format: ACCOUNT_KEY_FORMAT,
    version: 1,
    accountId: account.id,
    handle: account.handle,
    displayName: account.displayName,
    key,
    createdAt: new Date().toISOString(),
  };
}

async function createUniqueHandle(displayName: string) {
  const base = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 21) || "operator";
  for (let attempt = 0; attempt < 8; attempt++) {
    const suffix = randomBytes(3).toString("hex");
    const handle = `${base}_${suffix}`.slice(0, 32);
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.handle, handle)).limit(1);
    if (!existing.length) return handle;
  }
  return `operator_${randomBytes(8).toString("hex")}`;
}

function validAccountKeyFile(value: unknown): value is AccountRecoveryFile {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AccountRecoveryFile>;
  return candidate.format === ACCOUNT_KEY_FORMAT
    && candidate.version === 1
    && typeof candidate.accountId === "string"
    && UUID_PATTERN.test(candidate.accountId)
    && typeof candidate.handle === "string"
    && candidate.handle.length > 0
    && candidate.handle.length <= 32
    && typeof candidate.displayName === "string"
    && candidate.displayName.length <= 80
    && typeof candidate.createdAt === "string"
    && !Number.isNaN(Date.parse(candidate.createdAt))
    && typeof candidate.key === "string"
    && /^[A-Za-z0-9_-]{40,60}$/.test(candidate.key);
}

function validPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= MIN_PASSWORD_LENGTH && value.length <= MAX_PASSWORD_LENGTH;
}

export async function POST(request: Request) {
  try {
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 16_384) return Response.json({ error: "That request is too large." }, { status: 413 });

    const parsed: unknown = await request.json();
    const body = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
    const action = String(body.action || "");

    if (action === "logout") {
      await clearSession();
      return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "register") {
      const displayName = typeof body.displayName === "string" ? body.displayName.trim().replace(/\s+/g, " ").slice(0, 60) : "";
      const password = body.password;
      if (displayName.length < 2) return Response.json({ error: "Enter a name with at least 2 characters." }, { status: 400 });
      if (!validPassword(password)) return Response.json({ error: "Password must be between 8 and 128 characters." }, { status: 400 });

      const current = await getCurrentUser();
      if (current && !current.isGuest) return Response.json({ error: "You are already signed in." }, { status: 409 });

      const accountId = current?.id ?? randomUUID();
      const handle = await createUniqueHandle(displayName);
      const recoveryKey = randomBytes(32).toString("base64url");
      const passwordHash = await hashPassword(password);
      const recoveryKeyHash = keyDigest(accountId, recoveryKey);
      const account = { id: accountId, handle, displayName };

      if (current) {
        // Upgrade the active guest in place so any existing lab progress stays with the player.
        await db.update(users).set({
          displayName,
          handle,
          email: null,
          passwordHash,
          recoveryKeyHash,
          isGuest: false,
        }).where(eq(users.id, current.id));
      } else {
        await db.insert(users).values({
          id: accountId,
          displayName,
          handle,
          email: null,
          passwordHash,
          recoveryKeyHash,
          isGuest: false,
        });
      }

      await clearSession();
      await issueSession(accountId);
      const file = recoveryFileFor(account, recoveryKey);
      return Response.json({ ok: true, account: { handle, displayName }, recoveryFile: file }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "login") {
      const identifier = typeof body.identifier === "string" ? body.identifier.trim().toLowerCase() : "";
      const password = body.password;
      if (!identifier || identifier.length > 254 || !validPassword(password)) {
        return Response.json({ error: "Enter your handle or email and a valid password." }, { status: 400 });
      }
      const lookup = identifier.includes("@") ? eq(users.email, identifier) : eq(users.handle, identifier);
      const [account] = await db.select().from(users).where(lookup).limit(1);
      if (!account || account.isGuest || !account.passwordHash || !(await verifyPassword(password, account.passwordHash))) {
        return Response.json({ error: "Incorrect handle/email or password." }, { status: 401 });
      }
      await clearSession();
      await issueSession(account.id);
      return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "key-login") {
      const rawFile = typeof body.keyFile === "string" ? body.keyFile : "";
      if (!rawFile || rawFile.length > 8_192) return Response.json({ error: "Choose a valid Gamehack account key file." }, { status: 400 });
      let parsedFile: unknown;
      try { parsedFile = JSON.parse(rawFile); } catch { return Response.json({ error: "That file is not a valid Gamehack account key." }, { status: 400 }); }
      if (!validAccountKeyFile(parsedFile)) return Response.json({ error: "That file is not a valid Gamehack account key." }, { status: 400 });

      const [account] = await db.select().from(users).where(eq(users.id, parsedFile.accountId)).limit(1);
      const expected = account?.recoveryKeyHash;
      const supplied = keyDigest(parsedFile.accountId, parsedFile.key);
      const matches = typeof expected === "string"
        && /^[a-f0-9]{64}$/i.test(expected)
        && timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(supplied, "hex"));
      if (!account || account.isGuest || account.handle !== parsedFile.handle || !matches) {
        return Response.json({ error: "This account key is invalid or has been replaced." }, { status: 401 });
      }
      await clearSession();
      await issueSession(account.id);
      return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "recovery-key") {
      const account = await getCurrentUser();
      if (!account || account.isGuest) return Response.json({ error: "Sign in to an account before creating a recovery key." }, { status: 401 });
      const recoveryKey = randomBytes(32).toString("base64url");
      await db.update(users).set({ recoveryKeyHash: keyDigest(account.id, recoveryKey) }).where(eq(users.id, account.id));
      const file = recoveryFileFor(account, recoveryKey);
      return Response.json({ ok: true, recoveryFile: file }, { headers: { "Cache-Control": "no-store" } });
    }

    if (ACCOUNT_KEY_ACTIONS.has(action)) return Response.json({ error: "That account-key action is not available." }, { status: 400 });
    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return Response.json({ error: "Unable to complete that request. Please try again." }, { status: 500 });
  }
}
