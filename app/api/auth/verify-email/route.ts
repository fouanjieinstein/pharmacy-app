import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { verifyCode, type VerifyCodeResult } from "@/lib/server/verification";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";

const bodySchema = z.object({ code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code.") });

const ERROR_MESSAGES: Record<Extract<VerifyCodeResult, { ok: false }>["reason"], string> = {
  no_code: "No verification code is pending. Request a new one.",
  expired: "This code has expired. Request a new one.",
  too_many_attempts: "Too many incorrect attempts. Request a new code.",
  incorrect: "Incorrect code. Please try again.",
};

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  if (user.emailVerifiedAt) {
    return NextResponse.json({ error: "Your email is already verified." }, { status: 400 });
  }

  const ip = clientIp(request);
  const limit = rateLimit(`verify-email:${user.id}`, 10, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const result = await verifyCode(user.id, parsed.data.code);
  if (!result.ok) {
    return NextResponse.json({ error: ERROR_MESSAGES[result.reason] }, { status: 400 });
  }

  await db.auditLog.create({
    data: { actorId: user.id, action: "auth.email_verified", entityType: "User", entityId: user.id, ipAddress: ip },
  });

  return NextResponse.json({ ok: true });
}
