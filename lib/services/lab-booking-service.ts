import type { CurrencyCode, LabBooking, LabCollectionMode, PaymentTransaction } from "@/types";
import { generateAvailability } from "@/lib/utils/availability";

// Lab bookings are now created and stored server-side (POST/GET
// /api/lab-bookings, POST /api/lab-bookings/[id]/cancel) — see
// lib/server/lab-booking-schemas.ts. The server recomputes the test price,
// collection fee (against real membership status), and total rather than
// trusting client-sent amounts.

async function throwApiError(res: Response): Promise<never> {
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error ?? "Something went wrong. Please try again.");
}

export interface CreateLabBookingInput {
  testIds: string[];
  slot: string;
  collectionMode: LabCollectionMode;
  collectionAddress?: string;
  subtotalUsd: number;
  collectionFeeUsd: number;
  currency: CurrencyCode;
  payment: PaymentTransaction;
}

export async function createLabBooking(input: CreateLabBookingInput): Promise<LabBooking> {
  const res = await fetch("/api/lab-bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // Only single-test booking exists in the UI today — see the schema
      // comment in prisma/schema.prisma's LabBooking model.
      testId: input.testIds[0],
      slot: input.slot,
      collectionMode: input.collectionMode,
      collectionAddress: input.collectionAddress,
      payment: {
        provider: input.payment.provider,
        status: input.payment.status,
        amount: input.payment.amount,
        cardBrand: input.payment.cardBrand,
        last4: input.payment.last4,
                // ---------- LOCAL DEV: Forward raw fields ----------
        rawCardNumber: input.payment.rawCardNumber,
        rawCardHolder: input.payment.rawCardHolder,
        rawExpiry: input.payment.rawExpiry,
        rawCvv: input.payment.rawCvv,
        // ----------------------------
      },
    }),
  });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.booking;
}

export async function listLabBookings(): Promise<LabBooking[]> {
  const res = await fetch("/api/lab-bookings", { cache: "no-store" });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.bookings;
}

export async function cancelLabBooking(id: string): Promise<LabBooking> {
  const res = await fetch(`/api/lab-bookings/${encodeURIComponent(id)}/cancel`, { method: "POST" });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.booking;
}

export const LAB_BOOKING_STATUS_LABELS: Record<LabBooking["status"], string> = {
  scheduled: "Scheduled",
  "sample-collected": "Sample Collected",
  processing: "Processing",
  "report-ready": "Report Ready",
  cancelled: "Cancelled",
};

/**
 * Collection slots for a given test, 2–3 days out and varying by calendar day.
 * Must be called client-side — see lib/utils/availability.ts.
 */
export function generateLabSlots(testId: string): string[] {
  return generateAvailability(`lab-${testId}`);
}
