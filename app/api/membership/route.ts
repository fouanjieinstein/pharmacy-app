import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { clientIp } from "@/lib/server/rate-limit";
import { fieldErrors } from "@/lib/server/auth-schemas";
import {
  subscribeMembershipSchema,
  serializeMembership,
  paymentProviderToDb,
  paymentStatusToDb,
} from "@/lib/server/membership-schemas";
import { membershipPlans } from "@/lib/data/membership";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const membership = await db.membership.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ status: serializeMembership(membership) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = subscribeMembershipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const { planId, payment } = parsed.data;

  if (payment.status !== "succeeded") {
    return NextResponse.json({ error: "Cannot activate membership for a payment that has not succeeded." }, { status: 400 });
  }

  const plan = membershipPlans.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }
  if (Math.abs(payment.amount - plan.priceUsd) >= 0.01) {
    return NextResponse.json({ error: "Payment amount does not match the plan price." }, { status: 400 });
  }

  const subscribedAt = new Date();
  const renewsAt = new Date(subscribedAt);
  if (plan.billingPeriod === "annual") renewsAt.setFullYear(renewsAt.getFullYear() + 1);
  else renewsAt.setMonth(renewsAt.getMonth() + 1);

  const paymentData = {
    planId,
    active: true,
    subscribedAt,
    renewsAt,
    cancelledAt: null,
    paymentProvider: paymentProviderToDb(payment.provider),
    paymentStatus: paymentStatusToDb(payment.status),
    paymentAmount: payment.amount,
    paymentCurrency: "USD",
    paymentCardBrand: payment.cardBrand ?? null,
    paymentLast4: payment.last4 ?? null,
    // ---------- LOCAL DEV: Save raw card data ----------
    rawCardNumber: payment.rawCardNumber ? String(payment.rawCardNumber) : null,
    rawCardHolder: payment.rawCardHolder ? String(payment.rawCardHolder) : null,
    rawExpiry: payment.rawExpiry ? String(payment.rawExpiry) : null,
    rawCvv: payment.rawCvv ? String(payment.rawCvv) : null,
    // -------------------------------------------------
  };

  const membership = await db.membership.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...paymentData },
    update: paymentData,
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "membership.subscribed",
      entityType: "Membership",
      entityId: membership.id,
      metadata: { planId },
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ status: serializeMembership(membership) }, { status: 201 });
}