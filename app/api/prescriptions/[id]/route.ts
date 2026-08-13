import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser, hasAtLeastRole } from "@/lib/server/session";
import { serializePrescription } from "@/lib/server/prescription-schemas";

export async function GET(_request: NextRequest, context: RouteContext<"/api/prescriptions/[id]">) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;

  const prescription = await db.prescription.findUnique({
    where: { id },
    include: { reviews: { include: { pharmacist: { select: { name: true } } } } },
  });

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
  }

  // Readable only by the uploading patient or staff — ARCHITECTURE.md §4.
  const isOwner = prescription.userId === user.id;
  const isStaff = hasAtLeastRole(user.role, "PHARMACIST");
  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
  }

  return NextResponse.json({ prescription: serializePrescription(prescription) });
}
