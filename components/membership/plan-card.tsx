"use client";

import { Check } from "lucide-react";
import type { MembershipPlan } from "@/types";
import { useCurrency } from "@/lib/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export function PlanCard({
  plan,
  highlighted,
  currentPlanId,
  onSubscribe,
}: {
  plan: MembershipPlan;
  highlighted?: boolean;
  currentPlanId?: string | null;
  onSubscribe: (plan: MembershipPlan) => void;
}) {
  const { format } = useCurrency();
  const isCurrent = currentPlanId === plan.id;

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border p-6",
        highlighted ? "border-brand-gold-400 bg-brand-gold-50/40 shadow-md" : "border-brand-gray-200 bg-white"
      )}
    >
      {highlighted && <Badge variant="gold" className="mb-3 w-fit">Best Value</Badge>}
      <h3 className="font-display text-lg text-brand-navy-900">{plan.name}</h3>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-3xl text-brand-navy-900">{format(plan.priceUsd)}</span>
        <span className="text-sm text-brand-gray-500">/ {plan.billingPeriod === "monthly" ? "month" : "year"}</span>
      </div>

      <ul className="mt-5 space-y-2.5 text-sm text-brand-gray-600">
        {plan.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-emerald-600" />
            {b}
          </li>
        ))}
      </ul>

      <Button
        fullWidth
        size="lg"
        variant={highlighted ? "gold" : "outline"}
        className="mt-6"
        disabled={isCurrent}
        onClick={() => onSubscribe(plan)}
      >
        {isCurrent ? "Current Plan" : "Subscribe"}
      </Button>
    </div>
  );
}
