import { z } from "zod";
import { countries } from "@/lib/data/countries";
import type { Address as DbAddress } from "@/lib/generated/prisma";

const countryCodes = countries.map((c) => c.code) as [string, ...string[]];

// Server-side validation. The client also validates for UX, but that is never
// relied upon — every field is re-checked here before it reaches the database.
export const addressSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  phone: z.string().trim().min(1, "Phone is required").max(32),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(190),
  addressLine1: z.string().trim().min(1, "Address is required").max(190),
  addressLine2: z.string().trim().max(190).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(90),
  stateProvince: z.string().trim().min(1, "State is required").max(90),
  postalCode: z.string().trim().min(1, "Postal code is required").max(24),
  country: z.enum(countryCodes, { message: "Select a valid country" }),
  isDefault: z.boolean().optional(),
});

export const addressUpdateSchema = addressSchema.partial();

export type AddressInput = z.infer<typeof addressSchema>;
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;

/** DB rows use `countryCode`; the front-end domain type uses `country`. */
export function serializeAddress(address: DbAddress) {
  return {
    id: address.id,
    fullName: address.fullName,
    phone: address.phone,
    email: address.email,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? undefined,
    city: address.city,
    stateProvince: address.stateProvince,
    postalCode: address.postalCode,
    country: address.countryCode,
    isDefault: address.isDefault,
  };
}
