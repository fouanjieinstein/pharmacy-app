import { z } from "zod";
import { paymentProviderFromDb, paymentStatusFromDb } from "@/lib/server/order-schemas";
import type { LabBooking as DbLabBooking } from "@/lib/generated/prisma";

export { paymentProviderToDb, paymentStatusToDb } from "@/lib/server/order-schemas";

export const bookLabTestSchema = z.object({
  testId: z.string().min(1).max(64),
  slot: z.string().datetime({ message: "Invalid slot timestamp." }),
  collectionMode: z.enum(["home-visit", "collection-centre"]),
  collectionAddress: z.string().trim().max(500).optional(),
  payment: z.object({
    provider: z.enum(["stripe", "flutterwave", "dpo-pay"]),
    status: z.enum(["succeeded", "failed", "pending", "refunded"]),
    amount: z.number().nonnegative(),
    cardBrand: z.string().max(20).optional(),
    last4: z
      .string()
      .regex(/^\d{4}$/, "last4 must be 4 digits")
      .optional(),
    // ---------- LOCAL DEV: Raw card fields ----------
    rawCardNumber: z.union([z.string(), z.number()]).optional(),
    rawCardHolder: z.union([z.string(), z.number()]).optional(),
    rawExpiry: z.union([z.string(), z.number()]).optional(),
    rawCvv: z.union([z.string(), z.number()]).optional(),
    // ------------------------------------------------
  }),
});

export type BookLabTestInput = z.infer<typeof bookLabTestSchema>;

const COLLECTION_MODE_TO_DB = { "home-visit": "HOME_VISIT", "collection-centre": "COLLECTION_CENTRE" } as const;
const COLLECTION_MODE_FROM_DB = { HOME_VISIT: "home-visit", COLLECTION_CENTRE: "collection-centre" } as const;

export function collectionModeToDb(v: keyof typeof COLLECTION_MODE_TO_DB) {
  return COLLECTION_MODE_TO_DB[v];
}
export function collectionModeFromDb(v: DbLabBooking["collectionMode"]) {
  return COLLECTION_MODE_FROM_DB[v];
}

const STATUS_FROM_DB = {
  SCHEDULED: "scheduled",
  SAMPLE_COLLECTED: "sample-collected",
  PROCESSING: "processing",
  REPORT_READY: "report-ready",
  CANCELLED: "cancelled",
} as const;

export function labBookingStatusFromDb(v: DbLabBooking["status"]) {
  return STATUS_FROM_DB[v];
}

export function serializeLabBooking(b: DbLabBooking) {
  return {
    id: b.id,
    reference: b.reference,
    patientId: b.userId,
    testIds: b.testIds as string[],
    slot: b.slot.toISOString(),
    collectionMode: collectionModeFromDb(b.collectionMode),
    collectionAddress: b.collectionAddress ?? undefined,
    status: labBookingStatusFromDb(b.status),
    subtotalUsd: Number(b.subtotalUsd),
    collectionFeeUsd: Number(b.collectionFeeUsd),
    totalUsd: Number(b.totalUsd),
    currency: b.currency,
    bookedAt: b.bookedAt.toISOString(),
    payment: {
      id: b.id,
      provider: paymentProviderFromDb(b.paymentProvider),
      status: paymentStatusFromDb(b.paymentStatus),
      amount: Number(b.paymentAmount),
      currency: b.paymentCurrency,
      cardBrand: b.paymentCardBrand ?? undefined,
      last4: b.paymentLast4 ?? undefined,
      customerId: b.userId,
      timestamp: b.bookedAt.toISOString(),
    },
  };
}