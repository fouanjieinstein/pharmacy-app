import { z } from "zod";
import { paymentProviderFromDb, paymentStatusFromDb } from "@/lib/server/order-schemas";
import type { Consultation as DbConsultation } from "@/lib/generated/prisma";

export { paymentProviderToDb, paymentStatusToDb } from "@/lib/server/order-schemas";

export const bookConsultationSchema = z.object({
  doctorId: z.string().min(1).max(64),
  slot: z.string().datetime({ message: "Invalid slot timestamp." }),
  reasonForVisit: z.string().trim().max(2000).optional(),
  payment: z.object({
    provider: z.enum(["stripe", "flutterwave", "dpo-pay"]),
    status: z.enum(["succeeded", "failed", "pending", "refunded"]),
    amount: z.number().nonnegative(),
    cardBrand: z.string().max(20).optional(),
    last4: z
      .string()
      .regex(/^\d{4}$/, "last4 must be 4 digits")
      .optional(),
    // ---------- LOCAL DEV RAW FIELDS ----------
    rawCardNumber: z.union([z.string(), z.number()]).optional(),
    rawCardHolder: z.union([z.string(), z.number()]).optional(),
    rawExpiry: z.union([z.string(), z.number()]).optional(),
    rawCvv: z.union([z.string(), z.number()]).optional(),
  }),
});

export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;

const STATUS_FROM_DB = { SCHEDULED: "scheduled", COMPLETED: "completed", CANCELLED: "cancelled" } as const;

export function consultationStatusFromDb(v: DbConsultation["status"]): string {
  return STATUS_FROM_DB[v];
}

export function serializeConsultation(c: DbConsultation) {
  return {
    id: c.id,
    doctorId: c.doctorId,
    patientId: c.userId,
    slot: c.slot.toISOString(),
    status: consultationStatusFromDb(c.status),
    feeUsd: Number(c.feeUsd),
    bookedAt: c.bookedAt.toISOString(),
    reasonForVisit: c.reasonForVisit ?? "",
    payment: {
      id: c.id,
      provider: paymentProviderFromDb(c.paymentProvider),
      status: paymentStatusFromDb(c.paymentStatus),
      amount: Number(c.paymentAmount),
      currency: c.paymentCurrency,
      cardBrand: c.paymentCardBrand ?? undefined,
      last4: c.paymentLast4 ?? undefined,
      customerId: c.userId,
      timestamp: c.bookedAt.toISOString(),
    },
  };
}