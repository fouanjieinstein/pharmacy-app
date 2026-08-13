import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/password";
import { createSession, setSessionCookie } from "@/lib/server/session";
import { registerSchema, fieldErrors } from "@/lib/server/auth-schemas";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";
import { issueVerificationCode } from "@/lib/server/verification";

export async function POST(request: Request) {
  const ip = clientIp(request);

  // Registration is rate limited per IP to blunt automated account creation.
  const limit = rateLimit(`register:${ip}`, 5, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many sign-up attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    // Deliberately specific: for a consumer signup form, telling the user the
    // address is taken is far more usable than a generic error, and the same
    // fact is already discoverable via the login form.
    return NextResponse.json(
      { error: "An account with that email already exists.", fields: { email: "Email already registered" } },
      { status: 409 }
    );
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await hashPassword(password),
      role: "CUSTOMER", // Elevated roles are never self-assignable.
    },
    select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true },
  });

  const { token, expiresAt } = await createSession(user.id, {
    userAgent: request.headers.get("user-agent"),
    ipAddress: ip,
  });
  await setSessionCookie(token, expiresAt);

  await db.auditLog.create({
    data: { actorId: user.id, action: "auth.register", entityType: "User", entityId: user.id, ipAddress: ip },
  });

  // Verification email is best-effort — a failed send never blocks account
  // creation; the account owner can request a fresh code from /verify-email.
  const verification = await issueVerificationCode(user);

  return NextResponse.json({ user, emailVerificationSent: verification.sent }, { status: 201 });
}
