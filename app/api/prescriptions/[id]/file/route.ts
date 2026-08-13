import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser, hasAtLeastRole } from "@/lib/server/session";
import { clientIp } from "@/lib/server/rate-limit";
import { readPrescriptionFile } from "@/lib/server/file-storage";

export async function GET(request: NextRequest, context: RouteContext<"/api/prescriptions/[id]/file">) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;

  const prescription = await db.prescription.findUnique({
    where: { id },
    select: { id: true, userId: true, fileName: true, fileType: true, storageKey: true },
  });

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
  }

  const isOwner = prescription.userId === user.id;
  const isStaff = hasAtLeastRole(user.role, "PHARMACIST");
  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
  }

  // Every read is logged — ARCHITECTURE.md §4 requires an audit trail for
  // prescription access, not just prescription decisions.
  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "prescription.viewed",
      entityType: "Prescription",
      entityId: prescription.id,
      ipAddress: clientIp(request),
    },
  });

  const buffer = await readPrescriptionFile(prescription.storageKey);
  const safeFileName = prescription.fileName.replace(/["\r\n]/g, "");

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": prescription.fileType,
      "Content-Disposition": `inline; filename="${safeFileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
