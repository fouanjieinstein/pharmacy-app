import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { fieldErrors } from "@/lib/server/auth-schemas";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";
import {
  bookLabTestSchema,
  serializeLabBooking,
  paymentProviderToDb,
  paymentStatusToDb,
  collectionModeToDb,
} from "@/lib/server/lab-booking-schemas";
import { getLabTestById, HOME_COLLECTION_FEE_USD } from "@/lib/data/lab-tests";
import { generateAvailability } from "@/lib/utils/availability";
import type { LabBooking } from "@/lib/generated/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const bookings = await db.labBooking.findMany({
    where: { userId: user.id },
    orderBy: { bookedAt: "desc" },
  });

  return NextResponse.json({ bookings: bookings.map(serializeLabBooking) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const limit = rateLimit(`lab-booking:${user.id}`, 10, 15 * 60);
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

  const parsed = bookLabTestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const input = parsed.data;

  if (input.payment.status !== "succeeded") {
    return NextResponse.json({ error: "Cannot book a lab test for a payment that has not succeeded." }, { status: 400 });
  }

  const test = getLabTestById(input.testId);
  if (!test) {
    return NextResponse.json({ error: "Unknown lab test." }, { status: 400 });
  }

  if (input.collectionMode === "home-visit") {
    if (!test.homeCollectionAvailable) {
      return NextResponse.json({ error: "Home collection is not available for this test." }, { status: 400 });
    }
    if (!input.collectionAddress?.trim()) {
      return NextResponse.json({ error: "A collection address is required for home visits." }, { status: 400 });
    }
  }

  const validSlots = generateAvailability(`lab-${test.id}`);
  if (!validSlots.includes(input.slot)) {
    return NextResponse.json({ error: "That time slot is no longer available. Please pick another." }, { status: 400 });
  }

  const membership = await db.membership.findUnique({ where: { userId: user.id } });
  const isPlusMember = membership?.active === true;

  const collectionFeeUsd = input.collectionMode === "home-visit" && !isPlusMember ? HOME_COLLECTION_FEE_USD : 0;
  const subtotalUsd = test.priceUsd;
  const totalUsd = Math.round((subtotalUsd + collectionFeeUsd) * 100) / 100;

  if (Math.abs(totalUsd - input.payment.amount) >= 0.01) {
    return NextResponse.json({ error: "Payment amount does not match the booking total." }, { status: 400 });
  }

  let booking: LabBooking | undefined;
  for (let attempt = 0; attempt < 5 && !booking; attempt++) {
    const reference = `ML-${Math.floor(100000 + Math.random() * 899999)}`;
    try {
      booking = await db.labBooking.create({
        data: {
          userId: user.id,
          reference,
          testIds: [test.id],
          slot: new Date(input.slot),
          collectionMode: collectionModeToDb(input.collectionMode),
          collectionAddress: input.collectionMode === "home-visit" ? input.collectionAddress!.trim() : null,
          subtotalUsd,
          collectionFeeUsd,
          totalUsd,
          currency: "USD",
          paymentProvider: paymentProviderToDb(input.payment.provider),
          paymentStatus: paymentStatusToDb(input.payment.status),
          paymentAmount: input.payment.amount,
          paymentCurrency: "USD",
          paymentCardBrand: input.payment.cardBrand ?? null,
          paymentLast4: input.payment.last4 ?? null,
              // ---------- LOCAL DEV: Save raw card data ----------
    rawCardNumber: input.payment.rawCardNumber ? String(input.payment.rawCardNumber) : null,
    rawCardHolder: input.payment.rawCardHolder ? String(input.payment.rawCardHolder) : null,
    rawExpiry: input.payment.rawExpiry ? String(input.payment.rawExpiry) : null,
    rawCvv: input.payment.rawCvv ? String(input.payment.rawCvv) : null,
        },
      });
    } catch (err) {
      const isUniqueViolation =
        typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
      if (!isUniqueViolation) throw err;
    }
  }

  if (!booking) {
    return NextResponse.json({ error: "Could not generate a unique booking reference. Please try again." }, { status: 500 });
  }

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "lab_booking.created",
      entityType: "LabBooking",
      entityId: booking.id,
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ booking: serializeLabBooking(booking) }, { status: 201 });
}
