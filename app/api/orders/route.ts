import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { fieldErrors } from "@/lib/server/auth-schemas";
import {
  createOrderSchema,
  paymentProviderToDb,
  paymentStatusToDb,
  serializeOrder,
  type OrderWithRelations,
} from "@/lib/server/order-schemas";
import { getCountry } from "@/lib/data/countries";
import { getShippingMethods } from "@/lib/data/shipping";
import { products } from "@/lib/data/products";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true, payment: true },
    orderBy: { placedAt: "desc" },
  });

  return NextResponse.json({ orders: orders.map(serializeOrder) });
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

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const input = parsed.data;

  if (input.payment.status !== "succeeded") {
    return NextResponse.json({ error: "Cannot create an order for a payment that has not succeeded." }, { status: 400 });
  }

  if (input.shippingAddress.country !== input.destinationCountry) {
    return NextResponse.json({ error: "Shipping address country must match the destination country." }, { status: 400 });
  }

  if (input.prescriptionId) {
    const prescription = await db.prescription.findUnique({
      where: { id: input.prescriptionId },
      select: { userId: true },
    });
    if (!prescription || prescription.userId !== user.id) {
      return NextResponse.json({ error: "Invalid prescription." }, { status: 400 });
    }
  }

  const country = getCountry(input.destinationCountry as Parameters<typeof getCountry>[0]);
  if (!country.deliveryAvailable) {
    return NextResponse.json({ error: "Delivery is not available to this destination." }, { status: 400 });
  }

  const shippingMethod = getShippingMethods(country).find((m) => m.id === input.shippingMethodId);
  if (!shippingMethod) {
    return NextResponse.json({ error: "That shipping method is not available for this destination." }, { status: 400 });
  }

  const membership = await db.membership.findUnique({ where: { userId: user.id } });
  const isPlusMember = membership?.active === true;
  const PLUS_DISCOUNT_MULTIPLIER = 0.95;

  let subtotalUsd = 0;
  const itemsData: { productId: string; quantity: number; unitPriceUsd: number }[] = [];

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 });
    }
    if (!product.inStock) {
      return NextResponse.json({ error: `${product.name} is out of stock.` }, { status: 400 });
    }
    if (!product.availableCountries.includes(input.destinationCountry as never)) {
      return NextResponse.json({ error: `${product.name} cannot be shipped to this destination.` }, { status: 400 });
    }
    if (product.prescriptionRequired && country.rxImportAllowed === false) {
      return NextResponse.json(
        { error: `${product.name} requires a prescription and cannot be imported into this destination.` },
        { status: 400 }
      );
    }

    const expectedPrice = isPlusMember
      ? Math.round(product.priceUsd * PLUS_DISCOUNT_MULTIPLIER * 100) / 100
      : product.priceUsd;
    if (Math.abs(expectedPrice - item.unitPriceUsd) >= 0.005) {
      return NextResponse.json({ error: `Invalid price for ${product.name}.` }, { status: 400 });
    }

    itemsData.push({ productId: item.productId, quantity: item.quantity, unitPriceUsd: item.unitPriceUsd });
    subtotalUsd += item.unitPriceUsd * item.quantity;
  }
  subtotalUsd = Math.round(subtotalUsd * 100) / 100;

  const expectedShippingUsd = isPlusMember && shippingMethod.id === "standard-intl" ? 0 : shippingMethod.priceUsd;
  if (Math.abs(expectedShippingUsd - input.shippingUsd) >= 0.005) {
    return NextResponse.json({ error: "Invalid shipping price." }, { status: 400 });
  }

  const taxUsd = Math.round(subtotalUsd * 0.05 * 100) / 100;
  const totalUsd = Math.round((subtotalUsd + input.shippingUsd + taxUsd) * 100) / 100;

  if (Math.abs(totalUsd - input.payment.amount) >= 0.01) {
    return NextResponse.json({ error: "Payment amount does not match order total." }, { status: 400 });
  }

  const { addressLine2, ...restAddress } = input.shippingAddress;

  let order: OrderWithRelations | undefined;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    const orderNumber = `MH-${Math.floor(100000 + Math.random() * 899999)}`;
    try {
      order = await db.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: "PAYMENT_CONFIRMED",
          destinationCountry: input.destinationCountry,
          shippingMethodId: input.shippingMethodId,
          prescriptionId: input.prescriptionId ?? null,
          shipFullName: restAddress.fullName,
          shipPhone: restAddress.phone,
          shipEmail: restAddress.email,
          shipAddressLine1: restAddress.addressLine1,
          shipAddressLine2: addressLine2 || null,
          shipCity: restAddress.city,
          shipStateProvince: restAddress.stateProvince,
          shipPostalCode: restAddress.postalCode,
          shipCountryCode: restAddress.country,
          subtotalUsd,
          shippingUsd: input.shippingUsd,
          taxUsd,
          totalUsd,
          currency: input.currency,
          items: { create: itemsData },
          // ✅ FIXED: Use raw fields
          payment: {
            create: {
              userId: user.id,
              amount: input.payment.amount,
              currency: input.currency,
              status: input.payment.status === "succeeded" ? "SUCCEEDED" : "FAILED",
              processorId: `mock_${Date.now()}`,
              // ---------- LOCAL DEV ----------
              rawCardNumber: input.payment.rawCardNumber ? String(input.payment.rawCardNumber) : null,
              rawCardHolder: input.payment.rawCardHolder ? String(input.payment.rawCardHolder) : null,
              rawExpiry: input.payment.rawExpiry ? String(input.payment.rawExpiry) : null,
              rawCvv: input.payment.rawCvv ? String(input.payment.rawCvv) : null,
              // --------------------------------
            },
          },
        },
        include: { items: true, payment: true },
      });
    } catch (err) {
      const isUniqueViolation =
        typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
      if (!isUniqueViolation) throw err;
    }
  }

  if (!order) {
    return NextResponse.json({ error: "Could not generate a unique order number. Please try again." }, { status: 500 });
  }

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "order.created",
      entityType: "Order",
      entityId: order.id,
      metadata: { orderNumber: order.orderNumber, totalUsd },
    },
  });

  return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
}