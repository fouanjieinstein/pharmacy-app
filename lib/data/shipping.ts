import type { ShippingMethod, Country } from "@/types";

export function getShippingMethods(country: Country): ShippingMethod[] {
  const methods: ShippingMethod[] = [
    {
      id: "standard-intl",
      name: "Standard International",
      description: "Reliable tracked delivery via our international logistics partners.",
      priceUsd: 9.99,
      estimatedDays: country.standardDeliveryDays,
    },
    {
      id: "express-intl",
      name: "Express International",
      description: "Priority handling and expedited transit for faster delivery.",
      priceUsd: 24.99,
      estimatedDays: country.expressDeliveryDays,
    },
  ];

  if (country.coldChainAvailable) {
    methods.push({
      id: "cold-chain",
      name: "Cold-Chain Delivery",
      description: "Temperature-controlled packaging and transit for cold-chain-sensitive medicines.",
      priceUsd: 39.99,
      estimatedDays: [country.expressDeliveryDays[0], country.expressDeliveryDays[1] + 1],
      requiresColdChain: true,
    });
  }

  return methods;
}
