"use client";

import { useState } from "react";
import { Crown, Truck, Stethoscope, ShieldCheck, Sparkles } from "lucide-react";
import { membershipPlans, getMembershipPlan } from "@/lib/data/membership";
import { useMembership } from "@/lib/context/membership-context";
import { useToast } from "@/lib/context/toast-context";
import { PlanCard } from "@/components/membership/plan-card";
import { SubscribeModal } from "@/components/membership/subscribe-modal";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import type { MembershipPlan } from "@/types";

const perks = [
  { icon: Sparkles, title: "5% Member Pricing", description: "Automatically applied on every product, every order." },
  { icon: Truck, title: "Free Standard Shipping", description: "Standard International shipping fees waived." },
  { icon: Stethoscope, title: "10% Off Consultations", description: "Discounted doctor consultation fees." },
  { icon: ShieldCheck, title: "Priority Rx Review", description: "Your prescriptions move to the front of the pharmacist review queue." },
];

export function PlusClient() {
  const { status, isPlusMember, cancelMembership } = useMembership();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const currentPlan = status.planId ? getMembershipPlan(status.planId) : undefined;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((p) => (
          <div key={p.title} className="rounded-md border border-brand-gray-200 bg-white p-5">
            <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-gold-50 text-brand-gold-600">
              <p.icon className="size-5" />
            </span>
            <p className="text-sm font-semibold text-brand-navy-900">{p.title}</p>
            <p className="mt-1 text-xs text-brand-gray-500">{p.description}</p>
          </div>
        ))}
      </div>

      {isPlusMember ? (
        <Card className="mt-10 border-brand-gold-300">
          <CardBody>
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-brand-gold-600" />
              <h2 className="font-display text-lg text-brand-navy-900">You&apos;re a {currentPlan?.name} member</h2>
            </div>
            <p className="mt-2 text-sm text-brand-gray-600">
              Subscribed {status.subscribedAt && new Date(status.subscribedAt).toLocaleDateString()} · Renews{" "}
              {status.renewsAt && new Date(status.renewsAt).toLocaleDateString()}
            </p>
            <p className="mt-1 text-sm text-brand-gray-600">
              Member pricing is now applied automatically across the shop, cart, and checkout.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={async () => {
                const result = await cancelMembership();
                showToast(
                  result.ok ? "Meridian Plus membership cancelled." : (result.error ?? "Couldn't cancel membership."),
                  result.ok ? "info" : "error"
                );
              }}
            >
              Cancel Membership
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {membershipPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              highlighted={plan.billingPeriod === "annual"}
              currentPlanId={status.planId}
              onSubscribe={setSelectedPlan}
            />
          ))}
        </div>
      )}

      <SubscribeModal plan={selectedPlan} open={!!selectedPlan} onClose={() => setSelectedPlan(null)} />
    </div>
  );
}
