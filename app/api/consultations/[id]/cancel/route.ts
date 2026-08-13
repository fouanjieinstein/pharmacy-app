import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { clientIp } from "@/lib/server/rate-limit";
import { serializeConsultation } from "@/lib/server/consultation-schemas";

export async function POST(request: NextRequest, context: RouteContext<"/api/consultations/[id]/cancel">) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;

  const existing = await db.consultation.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
  }
  if (existing.status !== "SCHEDULED") {
    return NextResponse.json({ error: "Only a scheduled consultation can be cancelled." }, { status: 400 });
  }

  const updated = await db.consultation.update({
    where: { id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "consultation.cancelled",
      entityType: "Consultation",
      entityId: id,
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ consultation: serializeConsultation(updated) });
}
