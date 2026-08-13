"use client";

import { useState } from "react";
import { Truck, Zap, Snowflake, Crown } from "lucide-react";
import { getShippingMethods } from "@/lib/data/shipping";
import { getCountry } from "@/lib/data/countries";
import { useCurrency } from "@/lib/context/currency-context";
import { useMembership } from "@/lib/context/membership-context";
import type { CountryCode, ShippingMethod, ShippingMethodId } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const METHOD_ICON: Record<ShippingMethodId, typeof Truck> = {
  "standard-intl": Truck,
  "express-intl": Zap,
  "cold-chain": Snowflake,
};

export function StepShippingMethod({
  destinationCountry,
  selectedId,
  onNext,
  onBack,
}: {
  destinationCountry: CountryCode;
  selectedId: ShippingMethodId | null;
  onNext: (method: ShippingMethod) => void;
  onBack: () => void;
}) {
  const country = getCountry(destinationCountry);
  const { isPlusMember } = useMembership();
  const methods = getShippingMethods(country).map((m) =>
    m.id === "standard-intl" && isPlusMember ? { ...m, priceUsd: 0 } : m
  );
  const [selected, setSelected] = useState<ShippingMethodId | null>(selectedId ?? methods[0]?.id ?? null);
  const { format } = useCurrency();

  return (
    <div>
      <h2 className="font-display mb-1 text-xl text-brand-navy-900">Shipping Method</h2>
      <p className="mb-6 text-sm text-brand-gray-500">Choose a delivery option for shipment to {country.name}.</p>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = METHOD_ICON[method.id];
          const active = selected === method.id;
          return (
            <label key={method.id}>
              <Card className={cn("cursor-pointer transition-colors", active && "border-brand-emerald-500 ring-1 ring-brand-emerald-500")}>
                <CardBody className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping-method"
                    checked={active}
                    onChange={() => setSelected(method.id)}
                    className="size-4 text-brand-emerald-600"
                  />
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-navy-900">{method.name}</p>
                    <p className="text-xs text-brand-gray-500">{method.description}</p>
                    <p className="mt-1 text-xs text-brand-gray-500">
                      Estimated delivery: {method.estimatedDays[0]}–{method.estimatedDays[1]} business days
                    </p>
                  </div>
                  {method.id === "standard-intl" && isPlusMember ? (
                    <Badge variant="gold" icon={<Crown className="size-3" />}>Free with Plus</Badge>
                  ) : (
                    <span className="font-display text-lg text-brand-navy-900">{format(method.priceUsd)}</span>
                  )}
                </CardBody>
              </Card>
            </label>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          disabled={!selected}
          onClick={() => {
            const method = methods.find((m) => m.id === selected);
            if (method) onNext(method);
          }}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
