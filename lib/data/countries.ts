import type { Country, CountryCode } from "@/types";

// MOCK shipping-eligibility data for prototype purposes only.
// A production system must source these rules from a licensed
// international-logistics and pharmaceutical-import compliance
// provider, kept current with destination-country regulation changes.
export const countries: Country[] = [
  {
    code: "IN",
    name: "India",
    region: "South Asia",
    defaultCurrency: "INR",
    deliveryAvailable: true,
    rxImportAllowed: true,
    coldChainAvailable: true,
    customsNotice:
      "Domestic shipment within India. Prescription medicines require a valid prescription verified by our pharmacist team prior to dispatch.",
    standardDeliveryDays: [2, 4],
    expressDeliveryDays: [1, 2],
  },
  {
    code: "US",
    name: "United States",
    region: "North America",
    defaultCurrency: "USD",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: true,
    customsNotice:
      "US FDA import regulations restrict personal importation of most prescription medicines. Only OTC and wellness products can be shipped to US addresses on this platform.",
    standardDeliveryDays: [7, 12],
    expressDeliveryDays: [3, 5],
  },
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    defaultCurrency: "GBP",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "MHRA regulations restrict cross-border prescription dispensing into the UK. OTC and wellness products only. Import duties may apply.",
    standardDeliveryDays: [6, 10],
    expressDeliveryDays: [3, 5],
  },
  {
    code: "DE",
    name: "Germany",
    region: "Europe",
    defaultCurrency: "EUR",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "EU pharmaceutical import rules restrict prescription dispensing across borders. OTC and wellness products only. EU customs declaration required.",
    standardDeliveryDays: [6, 11],
    expressDeliveryDays: [3, 5],
  },
  {
    code: "FR",
    name: "France",
    region: "Europe",
    defaultCurrency: "EUR",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "EU pharmaceutical import rules restrict prescription dispensing across borders. OTC and wellness products only. EU customs declaration required.",
    standardDeliveryDays: [6, 11],
    expressDeliveryDays: [3, 5],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    region: "Middle East",
    defaultCurrency: "AED",
    deliveryAvailable: true,
    rxImportAllowed: true,
    coldChainAvailable: true,
    customsNotice:
      "UAE Ministry of Health import permits are required for select controlled medicines. Our pharmacist team will confirm eligibility during prescription review.",
    standardDeliveryDays: [4, 7],
    expressDeliveryDays: [2, 3],
  },
  {
    code: "CA",
    name: "Canada",
    region: "North America",
    defaultCurrency: "CAD",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "Health Canada restricts personal importation of most prescription medicines. OTC and wellness products only. Duties/taxes may apply at customs.",
    standardDeliveryDays: [7, 13],
    expressDeliveryDays: [4, 6],
  },
  {
    code: "AU",
    name: "Australia",
    region: "Oceania",
    defaultCurrency: "USD",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "TGA biosecurity and import rules restrict prescription medicine imports. OTC and wellness products only, subject to quantity limits.",
    standardDeliveryDays: [9, 15],
    expressDeliveryDays: [5, 8],
  },
  {
    code: "SG",
    name: "Singapore",
    region: "Southeast Asia",
    defaultCurrency: "USD",
    deliveryAvailable: true,
    rxImportAllowed: true,
    coldChainAvailable: true,
    customsNotice:
      "HSA permits are required for certain prescription categories. Our pharmacist team will confirm eligibility during prescription review.",
    standardDeliveryDays: [3, 6],
    expressDeliveryDays: [2, 3],
  },
  {
    code: "ZA",
    name: "South Africa",
    region: "Africa",
    defaultCurrency: "USD",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "SAHPRA import restrictions apply to prescription medicines. OTC and wellness products only on this platform at this time.",
    standardDeliveryDays: [8, 14],
    expressDeliveryDays: [5, 7],
  },
  {
    code: "NG",
    name: "Nigeria",
    region: "Africa",
    defaultCurrency: "USD",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "NAFDAC import restrictions apply to prescription medicines. OTC and wellness products only on this platform at this time.",
    standardDeliveryDays: [8, 15],
    expressDeliveryDays: [5, 8],
  },
  {
    code: "CM",
    name: "Cameroon",
    region: "Africa",
    defaultCurrency: "XAF",
    deliveryAvailable: true,
    rxImportAllowed: false,
    coldChainAvailable: false,
    customsNotice:
      "Local pharmaceutical import restrictions apply to prescription medicines. OTC and wellness products only on this platform at this time.",
    standardDeliveryDays: [9, 16],
    expressDeliveryDays: [5, 9],
  },
];

export function getCountry(code: CountryCode): Country {
  return countries.find((c) => c.code === code) ?? countries[0];
}
