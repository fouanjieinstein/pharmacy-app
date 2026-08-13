import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";
import { savePrescriptionFile } from "@/lib/server/file-storage";
import { serializePrescription } from "@/lib/server/prescription-schemas";
import { validatePrescriptionFile } from "@/lib/prescription-shared";

const REVIEW_INCLUDE = { reviews: { include: { pharmacist: { select: { name: true as const } } } } };

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const prescriptions = await db.prescription.findMany({
    where: { userId: user.id },
    include: REVIEW_INCLUDE,
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json({ prescriptions: prescriptions.map(serializePrescription) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const ip = clientIp(request);
  const limit = rateLimit(`prescription-upload:${user.id}`, 10, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Client-side validation is only for instant feedback — this is the real
  // check, against the actual bytes, never trusted from the client alone.
  const validation = validatePrescriptionFile(file);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storageKey = await savePrescriptionFile(buffer, file.name);

  const prescription = await db.prescription.create({
    data: {
      userId: user.id,
      fileName: file.name.slice(0, 255),
      fileType: file.type,
      fileSizeKb: Math.round(file.size / 1024),
      storageKey,
      status: "PENDING_REVIEW",
    },
    include: REVIEW_INCLUDE,
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "prescription.uploaded",
      entityType: "Prescription",
      entityId: prescription.id,
      ipAddress: ip,
    },
  });

  return NextResponse.json({ prescription: serializePrescription(prescription) }, { status: 201 });
}
