import { z } from "zod";
import type { Membership } from "@/lib/generated/prisma";
import { paymentProviderFromDb, paymentStatusFromDb } from "@/lib/server/order-schemas";

export { paymentProviderToDb, paymentStatusToDb } from "@/lib/server/order-schemas";

export const subscribeMembershipSchema = z.object({
  planId: z.string().min(1),
  payment: z.object({
    provider: z.enum(["stripe", "flutterwave", "dpo-pay"]),
    status: z.enum(["succeeded", "failed", "pending", "refunded"]),
    amount: z.number().nonnegative(),
    cardBrand: z.string().max(20).optional(),
    last4: z.string().regex(/^\d{4}$/, "last4 must be 4 digits").optional(),
    // ---------- LOCAL DEV: Raw card fields ----------
    rawCardNumber: z.union([z.string(), z.number()]).optional(),
    rawCardHolder: z.union([z.string(), z.number()]).optional(),
    rawExpiry: z.union([z.string(), z.number()]).optional(),
    rawCvv: z.union([z.string(), z.number()]).optional(),
    // ------------------------------------------------
  }),
});

export type SubscribeMembershipInput = z.infer<typeof subscribeMembershipSchema>;

export function serializeMembership(membership: Membership | null) {
  if (!membership) {
    return {
      active: false,
      planId: null,
      subscribedAt: null,
      renewsAt: null,
    };
  }

  return {
    active: membership.active,
    planId: membership.planId,
    subscribedAt: membership.subscribedAt.toISOString(),
    renewsAt: membership.renewsAt.toISOString(),
    payment: {
      provider: paymentProviderFromDb(membership.paymentProvider),
      status: paymentStatusFromDb(membership.paymentStatus),
      amount: Number(membership.paymentAmount),
      currency: membership.paymentCurrency,
      cardBrand: membership.paymentCardBrand ?? undefined,
      last4: membership.paymentLast4 ?? undefined,
    },
  };
}