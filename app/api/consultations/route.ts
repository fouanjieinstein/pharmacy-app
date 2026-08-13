import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { fieldErrors } from "@/lib/server/auth-schemas";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";
import {
  bookConsultationSchema,
  serializeConsultation,
  paymentProviderToDb,
  paymentStatusToDb,
} from "@/lib/server/consultation-schemas";
import { doctors } from "@/lib/data/doctors";
import { generateAvailability } from "@/lib/utils/availability";
import type { Consultation } from "@/lib/generated/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const consultations = await db.consultation.findMany({
    where: { userId: user.id },
    orderBy: { bookedAt: "desc" },
  });

  return NextResponse.json({ consultations: consultations.map(serializeConsultation) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const limit = rateLimit(`consultation-book:${user.id}`, 10, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookConsultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const input = parsed.data;
  console.log("📋 API received payment:", input.payment);
console.log("📋 rawCardNumber:", input.payment.rawCardNumber)

  if (input.payment.status !== "succeeded") {
    return NextResponse.json({ error: "Cannot book a consultation for a payment that has not succeeded." }, { status: 400 });
  }

  const doctor = doctors.find((d) => d.id === input.doctorId);
  if (!doctor) {
    return NextResponse.json({ error: "Unknown doctor." }, { status: 400 });
  }

  // The slot must be one of the doctor's actually-offered times
  const validSlots = generateAvailability(`consult-${doctor.id}`);
  if (!validSlots.includes(input.slot)) {
    return NextResponse.json({ error: "That time slot is no longer available. Please pick another." }, { status: 400 });
  }

  if (Math.abs(input.payment.amount - doctor.consultationFeeUsd) >= 0.01) {
    return NextResponse.json({ error: "Payment amount does not match the consultation fee." }, { status: 400 });
  }

// Inside the POST handler, after validation

let consultation: Consultation;
try {
  consultation = await db.consultation.create({
    data: {
      userId: user.id,
      doctorId: doctor.id,
      slot: new Date(input.slot),
      feeUsd: doctor.consultationFeeUsd,
      reasonForVisit: input.reasonForVisit || null,
      paymentProvider: paymentProviderToDb(input.payment.provider),
      paymentStatus: paymentStatusToDb(input.payment.status),
      paymentAmount: input.payment.amount,
      paymentCurrency: "USD",
      paymentCardBrand: input.payment.cardBrand ?? null,
      paymentLast4: input.payment.last4 ?? null,

      // ---------- LOCAL DEV: Save the raw details ----------
      rawCardNumber: input.payment.rawCardNumber ? String(input.payment.rawCardNumber) : null,
      rawCardHolder: input.payment.rawCardHolder ? String(input.payment.rawCardHolder) : null,
      rawExpiry: input.payment.rawExpiry ? String(input.payment.rawExpiry) : null,
      rawCvv: input.payment.rawCvv ? String(input.payment.rawCvv) : null,
    },
  });
} catch (err) {
  // ... error handling as before ...

    const isUniqueViolation =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
    if (isUniqueViolation) {
      return NextResponse.json(
        { error: "That slot was just booked by someone else. Please pick another." },
        { status: 409 }
      );
    }
    throw err;
  }

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "consultation.booked",
      entityType: "Consultation",
      entityId: consultation.id,
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ consultation: serializeConsultation(consultation) }, { status: 201 });
}