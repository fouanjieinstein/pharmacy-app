import type { MembershipPlan } from "@/types";

export const membershipPlans: MembershipPlan[] = [
  {
    id: "plus-monthly",
    billingPeriod: "monthly",
    name: "Meridian Plus Monthly",
    priceUsd: 6.99,
    discountPct: 5,
    benefits: [
      "5% member pricing on every product",
      "Free Standard International shipping",
      "Priority pharmacist prescription review",
      "10% off doctor consultation fees",
      "Early access to new product launches",
    ],
  },
  {
    id: "plus-annual",
    billingPeriod: "annual",
    name: "Meridian Plus Annual",
    priceUsd: 59.0,
    discountPct: 5,
    benefits: [
      "5% member pricing on every product",
      "Free Standard International shipping",
      "Priority pharmacist prescription review",
      "10% off doctor consultation fees",
      "Early access to new product launches",
      "2 months free vs. paying monthly",
    ],
  },
];

export function getMembershipPlan(id: string): MembershipPlan | undefined {
  return membershipPlans.find((p) => p.id === id);
}
