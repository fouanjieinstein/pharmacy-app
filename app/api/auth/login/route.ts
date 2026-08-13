import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { verifyPassword, hashPassword } from "@/lib/server/password";
import { createSession, setSessionCookie, destroyAllUserSessions } from "@/lib/server/session";
import { loginSchema, fieldErrors } from "@/lib/server/auth-schemas";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";

const MAX_FAILED_ATTEMPTS = 8;
const LOCKOUT_MINUTES = 15;

// A throwaway hash, compared against when the account doesn't exist so that a
// missing account costs the same time as a wrong password. Without this, an
// attacker can enumerate valid emails by measuring response time.
const DUMMY_HASH_PROMISE = hashPassword("meridian-timing-equaliser");

export async function POST(request: Request) {
  const ip = clientIp(request);

  const ipLimit = rateLimit(`login-ip:${ip}`, 20, 15 * 60);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const { email, password } = parsed.data;

  // Also limit per-account, so distributing across IPs doesn't bypass throttling.
  const accountLimit = rateLimit(`login-account:${email}`, 10, 15 * 60);
  if (!accountLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts for this account. Please try again later." },
      { status: 429, headers: { "Retry-After": String(accountLimit.retryAfterSeconds) } }
    );
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true, email: true, name: true, role: true, emailVerifiedAt: true,
      passwordHash: true, failedLoginCount: true, lockedUntil: true,
    },
  });

  // Uniform failure response — never reveals whether the email exists.
  const invalid = NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });

  if (!user) {
    await verifyPassword(await DUMMY_HASH_PROMISE, password);
    return invalid;
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    return NextResponse.json(
      { error: "This account is temporarily locked after repeated failed sign-ins. Try again shortly." },
      { status: 423 }
    );
  }

  const ok = await verifyPassword(user.passwordHash, password);

  if (!ok) {
    const failedLoginCount = user.failedLoginCount + 1;
    const shouldLock = failedLoginCount >= MAX_FAILED_ATTEMPTS;

    await db.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : null,
      },
    });

    if (shouldLock) {
      // Lock implies possible compromise attempt — drop any live sessions too.
      await destroyAllUserSessions(user.id);
      await db.auditLog.create({
        data: { actorId: user.id, action: "auth.account_locked", entityType: "User", entityId: user.id, ipAddress: ip },
      });
    }

    return invalid;
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await db.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockedUntil: null } });
  }

  const { token, expiresAt } = await createSession(user.id, {
    userAgent: request.headers.get("user-agent"),
    ipAddress: ip,
  });
  await setSessionCookie(token, expiresAt);

  await db.auditLog.create({
    data: { actorId: user.id, action: "auth.login", entityType: "User", entityId: user.id, ipAddress: ip },
  });

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerifiedAt: user.emailVerifiedAt },
  });
}
