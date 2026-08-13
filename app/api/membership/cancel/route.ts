import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { clientIp } from "@/lib/server/rate-limit";
import { serializeMembership } from "@/lib/server/membership-schemas";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const membership = await db.membership.findUnique({ where: { userId: user.id } });
  if (!membership || !membership.active) {
    return NextResponse.json({ error: "No active membership to cancel." }, { status: 400 });
  }

  const updated = await db.membership.update({
    where: { userId: user.id },
    data: { active: false, cancelledAt: new Date() },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "membership.cancelled",
      entityType: "Membership",
      entityId: updated.id,
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ status: serializeMembership(updated) });
}
