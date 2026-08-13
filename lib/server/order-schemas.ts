import { z } from "zod";
import { Prisma } from "@/lib/generated/prisma";
import type { CurrencyCode, CountryCode, ShippingMethodId, PaymentStatus } from "@/types";
// ✅ Import from payment-utils
import {
  paymentProviderFromDb,
  paymentStatusFromDb,
  paymentProviderToDb,
  paymentStatusToDb,
} from "@/lib/server/payment-utils";

// Re-export for convenience (so other files can still import from order-schemas)
export { paymentProviderToDb, paymentStatusToDb, paymentProviderFromDb, paymentStatusFromDb };

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPriceUsd: z.number().nonnegative(),
    })
  ),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    stateProvince: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(2).max(2),
  }),
  destinationCountry: z.string().min(2).max(2),
  shippingMethodId: z.string().min(1),
  shippingUsd: z.number().nonnegative(),
  currency: z.string().min(3).max(3),
  prescriptionId: z.string().optional(),
  payment: z.object({
    provider: z.enum(["stripe", "flutterwave", "dpo-pay"]),
    status: z.enum(["succeeded", "failed", "pending", "refunded"]),
    amount: z.number().nonnegative(),
    cardBrand: z.string().max(20).optional(),
    last4: z.string().regex(/^\d{4}$/).optional(),
    // ---------- LOCAL DEV ----------
    rawCardNumber: z.union([z.string(), z.number()]).optional(),
    rawCardHolder: z.union([z.string(), z.number()]).optional(),
    rawExpiry: z.union([z.string(), z.number()]).optional(),
    rawCvv: z.union([z.string(), z.number()]).optional(),
    // ------------------------------
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Prisma types with relations
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: { items: true; payment: true };
}>;

// Order status mapping
const ORDER_STATUS_FROM_DB = {
  ORDER_PLACED: "order_placed",
  PAYMENT_CONFIRMED: "payment_confirmed",
  PRESCRIPTION_VERIFIED: "prescription_verified",
  PHARMACY_PROCESSING: "pharmacy_processing",
  PACKED: "packed",
  DISPATCHED: "dispatched",
  IN_TRANSIT: "in_transit",
  CUSTOMS: "customs",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
} as const;

export function orderStatusFromDb(v: keyof typeof ORDER_STATUS_FROM_DB) {
  return ORDER_STATUS_FROM_DB[v];
}

export function serializeOrder(order: OrderWithRelations) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerId: order.userId,
    placedAt: order.placedAt.toISOString(),
    status: orderStatusFromDb(order.status),
    destinationCountry: order.destinationCountry,
    shippingMethodId: order.shippingMethodId as ShippingMethodId,
    shippingAddress: {
      fullName: order.shipFullName,
      phone: order.shipPhone,
      email: order.shipEmail,
      addressLine1: order.shipAddressLine1,
      addressLine2: order.shipAddressLine2 ?? undefined,
      city: order.shipCity,
      stateProvince: order.shipStateProvince,
      postalCode: order.shipPostalCode,
      country: order.shipCountryCode as CountryCode,
    },
    items: order.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPriceUsd: Number(i.unitPriceUsd),
    })),
    subtotalUsd: Number(order.subtotalUsd),
    shippingUsd: Number(order.shippingUsd),
    taxUsd: Number(order.taxUsd),
    totalUsd: Number(order.totalUsd),
    currency: order.currency as CurrencyCode,
    payment: order.payment ? {
      id: order.payment.id,
      provider: "stripe" as const,
      status: order.payment.status as PaymentStatus,
      amount: Number(order.payment.amount),
      currency: order.payment.currency as CurrencyCode,
      cardBrand: order.payment.rawCardHolder ? "visa" : undefined,
      last4: order.payment.rawCardNumber ? order.payment.rawCardNumber.slice(-4) : undefined,
      customerId: order.payment.userId,
      timestamp: order.payment.createdAt.toISOString(),
    } : undefined,
  };
}