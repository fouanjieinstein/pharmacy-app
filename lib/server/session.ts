import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/server/db";
import type { UserRole } from "@/lib/generated/prisma";

export const SESSION_COOKIE = "meridian_session";
const SESSION_TTL_DAYS = 14;

/**
 * Sessions are server-side records, not stateless JWTs. That costs a database
 * read per request, but buys immediate revocation — necessary when a
 * pharmacist or admin account is disabled, since a signed JWT would otherwise
 * stay valid until expiry.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerifiedAt: Date | null;
}

export async function createSession(
  userId: string,
  meta: { userAgent?: string | null; ipAddress?: string | null } = {}
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: meta.userAgent?.slice(0, 255) ?? null,
      ipAddress: meta.ipAddress?.slice(0, 64) ?? null,
    },
  });

  return { token, expiresAt };
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true, // not readable from JavaScript — blunts XSS session theft
    secure: process.env.NODE_ENV === "production", // HTTPS-only off localhost
    sameSite: "lax", // blocks cross-site POST CSRF while allowing normal navigation
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Returns the signed-in user, or null. Safe to call from any server context. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true } },
    },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    // Expired sessions are cleaned up lazily on next use.
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    return null;
  }

  return session.user;
}

export async function destroyCurrentSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  await clearSessionCookie();
}

/** Revokes every session for a user — used on password change or lockout. */
export async function destroyAllUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({ where: { userId } });
}

// --- Role-based access control -------------------------------------------

const ROLE_RANK: Record<UserRole, number> = {
  CUSTOMER: 0,
  PHARMACIST: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export function hasAtLeastRole(role: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

/**
 * Authorisation is always evaluated server-side against the session record.
 * A client-supplied role claim is never trusted.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthorizationError("AUTHENTICATION_REQUIRED");
  return user;
}

export async function requireRole(minimum: UserRole): Promise<SessionUser> {
  const user = await requireUser();
  if (!hasAtLeastRole(user.role, minimum)) throw new AuthorizationError("FORBIDDEN");
  return user;
}

export class AuthorizationError extends Error {
  constructor(public readonly reason: "AUTHENTICATION_REQUIRED" | "FORBIDDEN") {
    super(reason);
    this.name = "AuthorizationError";
  }
}

/** Constant-time string compare, for any future token comparisons. */
export function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
