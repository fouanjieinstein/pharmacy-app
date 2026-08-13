import { NextResponse } from "next/server";
import { destroyCurrentSession, getSessionUser } from "@/lib/server/session";
import { db } from "@/lib/server/db";
import { clientIp } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const user = await getSessionUser();

  await destroyCurrentSession();

  if (user) {
    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: "auth.logout",
        entityType: "User",
        entityId: user.id,
        ipAddress: clientIp(request),
      },
    });
  }

  // Idempotent: logging out without a session is still a success.
  return NextResponse.json({ ok: true });
}
