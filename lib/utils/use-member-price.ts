"use client";

import { useCurrency } from "@/lib/context/currency-context";
import { useMembership } from "@/lib/context/membership-context";

const PLUS_DISCOUNT_PCT = 5;

export function useMemberPrice() {
  const { format } = useCurrency();
  const { isPlusMember } = useMembership();

  const memberPriceUsd = (priceUsd: number) =>
    isPlusMember ? Math.round(priceUsd * (1 - PLUS_DISCOUNT_PCT / 100) * 100) / 100 : priceUsd;

  const formatMemberPrice = (priceUsd: number) => format(memberPriceUsd(priceUsd));

  return { isPlusMember, memberPriceUsd, formatMemberPrice, discountPct: PLUS_DISCOUNT_PCT };
}
