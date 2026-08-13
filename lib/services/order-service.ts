import type {
  Address,
  CartLineItem,
  CurrencyCode,
  Order,
  OrderStatus,
  OrderTrackingEvent,
  PaymentTransaction,
  ShippingMethodId,
} from "@/types";

export const ORDER_STATUS_SEQUENCE: { status: OrderStatus; label: string; description: string }[] = [
  { status: "order_placed", label: "Order Placed", description: "We've received your order." },
  { status: "payment_confirmed", label: "Payment Confirmed", description: "Your payment has been successfully processed." },
  { status: "prescription_verified", label: "Prescription Verified", description: "A licensed pharmacist has verified your prescription." },
  { status: "pharmacy_processing", label: "Pharmacy Processing", description: "Our pharmacy team is preparing your medication." },
  { status: "packed", label: "Packed", description: "Your order has been securely packed for shipment." },
  { status: "dispatched", label: "Dispatched", description: "Your order has left our fulfillment center." },
  { status: "in_transit", label: "In Transit", description: "Your order is on its way to the destination country." },
  { status: "customs", label: "Customs", description: "Your order is clearing destination-country customs." },
  { status: "out_for_delivery", label: "Out for Delivery", description: "Your order is out for final delivery." },
  { status: "delivered", label: "Delivered", description: "Your order has been delivered." },
];

function buildTrackingEvents(currentStatus: OrderStatus, placedAt: string): OrderTrackingEvent[] {
  const currentIndex = ORDER_STATUS_SEQUENCE.findIndex((s) => s.status === currentStatus);
  const placedTime = new Date(placedAt).getTime();

  return ORDER_STATUS_SEQUENCE.map((step, index) => {
    const completed = index <= currentIndex;
    return {
      status: step.status,
      label: step.label,
      description: step.description,
      completed,
      timestamp: completed ? new Date(placedTime + index * 1000 * 60 * 60 * 6).toISOString() : null,
    };
  });
}

function attachTrackingEvents(order: Omit<Order, "trackingEvents">): Order {
  return { ...order, trackingEvents: buildTrackingEvents(order.status, order.placedAt) };
}

async function throwApiError(res: Response): Promise<never> {
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error ?? "Something went wrong. Please try again.");
}

interface CreateOrderInput {
  cartItems: CartLineItem[];
  unitPriceFor: (id: string) => number;
  shippingAddress: Omit<Address, "id">;
  shippingMethodId: ShippingMethodId;
  shippingCostUsd: number;
  currency: CurrencyCode;
  payment: PaymentTransaction;
  prescriptionId?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const items = input.cartItems.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
    unitPriceUsd: input.unitPriceFor(i.productId),
  }));

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      shippingAddress: input.shippingAddress,
      shippingMethodId: input.shippingMethodId,
      shippingUsd: input.shippingCostUsd,
      destinationCountry: input.shippingAddress.country,
      currency: input.currency,
      prescriptionId: input.prescriptionId,
      payment: {
        // ✅ ADDED provider field
        provider: input.payment.provider || "stripe",
        status: input.payment.status,
        amount: input.payment.amount,
        cardBrand: input.payment.cardBrand,
        last4: input.payment.last4,
        // ---------- LOCAL DEV ----------
        rawCardNumber: input.payment.rawCardNumber,
        rawCardHolder: input.payment.rawCardHolder,
        rawExpiry: input.payment.rawExpiry,
        rawCvv: input.payment.rawCvv,
        // ------------------------------
      },
    }),
  });

  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return attachTrackingEvents(data.order);
}

export async function listOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders", { cache: "no-store" });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.orders.map(attachTrackingEvents);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return attachTrackingEvents(data.order);
}