"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, PackageSearch } from "lucide-react";
import { getOrderByNumber } from "@/lib/services/order-service";
import { getCountry } from "@/lib/data/countries";
import { formatMoney } from "@/lib/data/currencies";
import { useAuth } from "@/lib/context/auth-context";
import type { Order } from "@/types";
import { TrackingTimeline } from "@/components/checkout/tracking-timeline";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SignInPrompt } from "@/components/ui/sign-in-prompt";

export function TrackingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, loading: authLoading } = useAuth();
  const initialOrder = searchParams.get("order") ?? "";
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrder);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialOrder) {
      getOrderByNumber(initialOrder)
        .then(setOrder)
        .catch(() => setOrder(null));
      setSearched(true);
    }
  }, [initialOrder]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const number = orderNumberInput.trim();
    router.push(`/tracking?order=${encodeURIComponent(number)}`);
    getOrderByNumber(number)
      .then(setOrder)
      .catch(() => setOrder(null));
    setSearched(true);
  };

  if (!authLoading && !isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl">
        <SignInPrompt message="Sign in to track your order — order details are only visible to the account that placed them." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSearch} className="mb-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-gray-400" />
          <input
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            placeholder="Enter order number, e.g. MH-104822"
            aria-label="Order number"
            className="h-12 w-full rounded-sm border border-brand-gray-300 bg-white pl-10 pr-4 text-sm focus:border-brand-navy-900 focus:outline-none"
          />
        </div>
        <Button type="submit" size="lg">Track</Button>
      </form>

      {searched && !order && (
        <EmptyState
          icon={<PackageSearch className="size-12" />}
          title="Order not found"
          description="Double check your order number, or view your full order history from your account."
        />
      )}

      {order && (
        <div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-brand-gray-500">Order</p>
              <p className="font-display text-2xl text-brand-navy-900">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-brand-gray-500">Destination</p>
              <p className="text-sm font-medium text-brand-navy-900">{getCountry(order.destinationCountry).name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-brand-gray-500">Total</p>
              <p className="text-sm font-medium text-brand-navy-900">{formatMoney(order.totalUsd, order.currency)}</p>
            </div>
          </div>

          <Card>
            <CardBody>
              <TrackingTimeline events={order.trackingEvents} />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
