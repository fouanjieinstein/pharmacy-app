import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { issueVerificationCode } from "@/lib/server/verification";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  if (user.emailVerifiedAt) {
    return NextResponse.json({ error: "Your email is already verified." }, { status: 400 });
  }

  // Keyed by user, not IP — a shared/mobile IP shouldn't throttle one
  // account's resends because of another's.
  const limit = rateLimit(`resend-verification:${user.id}`, 3, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before requesting another code." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const result = await issueVerificationCode(user);
  if (!result.sent) {
    return NextResponse.json(
      { error: result.error ?? "Couldn't send the verification email." },
      { status: result.status ?? 502 }
    );
  }

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "auth.verification_resent",
      entityType: "User",
      entityId: user.id,
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ ok: true });
}
