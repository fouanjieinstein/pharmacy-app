"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, MapPin, CreditCard } from "lucide-react";
import { getOrderByNumber } from "@/lib/services/order-service";
import { products } from "@/lib/data/products";
import { getCountry } from "@/lib/data/countries";
import { formatMoney } from "@/lib/data/currencies";
import type { Order } from "@/types";
import { Card, CardBody } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderNumber) {
      setOrder(null);
      return;
    }
    getOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [orderNumber]);

  if (order === undefined) return null;

  if (!order) {
    return (
      <EmptyState
        icon={<Package className="size-12" />}
        title="Order not found"
        description="We couldn't find this order. Check your account for a full order history."
        action={
          <Link href="/account/orders" className={buttonVariants({ size: "lg" })}>
            View My Orders
          </Link>
        }
      />
    );
  }

  const country = getCountry(order.destinationCountry);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="font-display text-3xl text-brand-navy-900">Order Confirmed</h1>
        <p className="mt-2 text-sm text-brand-gray-500">
          Thank you — your order <strong className="text-brand-navy-900">{order.orderNumber}</strong> has been placed.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-5">
          <div className="flex items-start gap-3">
            <Package className="size-5 shrink-0 text-brand-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-navy-900">Items ({order.items.length})</p>
              <ul className="mt-2 space-y-1.5 text-sm text-brand-gray-600">
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <li key={item.productId} className="flex justify-between">
                      <span>{product?.name ?? "Item"} × {item.quantity}</span>
                      <span>{formatMoney(item.unitPriceUsd * item.quantity, order.currency)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-brand-gray-200 pt-4 text-sm">
            <div className="flex justify-between text-brand-gray-600">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotalUsd, order.currency)}</span>
            </div>
            <div className="flex justify-between text-brand-gray-600">
              <span>Shipping</span>
              <span>{formatMoney(order.shippingUsd, order.currency)}</span>
            </div>
            <div className="flex justify-between text-brand-gray-600">
              <span>Taxes / fees</span>
              <span>{formatMoney(order.taxUsd, order.currency)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-gray-200 pt-2 text-base font-semibold text-brand-navy-900">
              <span>Total</span>
              <span>{formatMoney(order.totalUsd, order.currency)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-brand-gray-200 pt-4">
            <MapPin className="size-5 shrink-0 text-brand-gray-400" />
            <div>
              <p className="text-sm font-semibold text-brand-navy-900">Shipping to</p>
              <p className="mt-1 text-sm text-brand-gray-600">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.stateProvince} {order.shippingAddress.postalCode}
                <br />
                {country.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-brand-gray-200 pt-4">
            <CreditCard className="size-5 shrink-0 text-brand-gray-400" />
            <div>
              <p className="text-sm font-semibold text-brand-navy-900">Payment</p>
              <p className="mt-1 text-sm text-brand-gray-600">
                {order.payment.cardBrand?.toUpperCase()} ending in {order.payment.last4} via{" "}
                {order.payment.provider.charAt(0).toUpperCase() + order.payment.provider.slice(1)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={`/tracking?order=${order.orderNumber}`} className={buttonVariants({ size: "lg", fullWidth: true })}>
          Track This Order
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
