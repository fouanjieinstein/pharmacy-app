import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { requireRole, AuthorizationError } from "@/lib/server/session";
import { clientIp } from "@/lib/server/rate-limit";
import { fieldErrors } from "@/lib/server/auth-schemas";
import {
  reviewDecisionSchema,
  prescriptionStatusToDb,
  serializePrescription,
} from "@/lib/server/prescription-schemas";

export async function POST(request: NextRequest, context: RouteContext<"/api/prescriptions/[id]/review">) {
  let user;
  try {
    // Authorisation is evaluated here, server-side, against the session
    // role — never a client-supplied claim (ARCHITECTURE.md §4).
    user = await requireRole("PHARMACIST");
  } catch (err) {
    if (err instanceof AuthorizationError) {
      const status = err.reason === "AUTHENTICATION_REQUIRED" ? 401 : 403;
      return NextResponse.json({ error: err.reason === "AUTHENTICATION_REQUIRED" ? "Authentication required." : "Forbidden." }, { status });
    }
    throw err;
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = reviewDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const existing = await db.prescription.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
  }

  const { decision, notes } = parsed.data;
  const dbStatus = prescriptionStatusToDb(decision);

  await db.$transaction([
    db.prescriptionReview.create({
      data: { prescriptionId: id, pharmacistId: user.id, decision: dbStatus, notes: notes ?? null },
    }),
    db.prescription.update({ where: { id }, data: { status: dbStatus } }),
  ]);

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "prescription.reviewed",
      entityType: "Prescription",
      entityId: id,
      metadata: { decision },
      ipAddress: clientIp(request),
    },
  });

  const updated = await db.prescription.findUniqueOrThrow({
    where: { id },
    include: { reviews: { include: { pharmacist: { select: { name: true } } } } },
  });

  return NextResponse.json({ prescription: serializePrescription(updated) });
}
