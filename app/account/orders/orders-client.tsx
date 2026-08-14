"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useToast } from "@/lib/context/toast-context";
import { listOrders, ORDER_STATUS_SEQUENCE } from "@/lib/services/order-service";
import { formatMoney } from "@/lib/data/currencies";
import { getCountry } from "@/lib/data/countries";
import type { Order } from "@/types";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { CardListSkeleton } from "@/components/ui/skeleton";

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch(() => showToast("Couldn't load your orders.", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <CardListSkeleton count={3} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-12" />}
        title="No orders yet"
        description="Your order history will appear here once you place your first order."
        action={
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Browse Shop
          </Link>
        }
      />
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      {orders.map((order) => {
        const statusLabel = ORDER_STATUS_SEQUENCE.find((s) => s.status === order.status)?.label ?? order.status;
        return (
          <Card key={order.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-navy-900">{order.orderNumber}</p>
                  <p className="text-xs text-brand-gray-500">
                    Placed {new Date(order.placedAt).toLocaleDateString()} · {getCountry(order.destinationCountry).name}
                  </p>
                </div>
                <Badge variant="emerald">{statusLabel}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-brand-gray-100 pt-3">
                <p className="text-sm text-brand-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                  <span className="font-medium text-brand-navy-900">{formatMoney(order.totalUsd, order.currency)}</span>
                </p>
                <Link
                  href={`/tracking?order=${order.orderNumber}`}
                  className="flex items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline"
                >
                  Track Order <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
