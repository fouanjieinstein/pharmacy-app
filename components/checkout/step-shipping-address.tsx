"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/data/countries";
import type { Address, CountryCode } from "@/types";

export type ShippingAddressForm = Omit<Address, "id">;

export function StepShippingAddress({
  value,
  onNext,
  onBack,
}: {
  value: ShippingAddressForm;
  onNext: (data: ShippingAddressForm) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState(value);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddressForm, string>>>({});

  const validate = () => {
    const next: Partial<Record<keyof ShippingAddressForm, string>> = {};
    if (!form.addressLine1.trim()) next.addressLine1 = "Address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.stateProvince.trim()) next.stateProvince = "State/Province is required.";
    if (!form.postalCode.trim()) next.postalCode = "Postal code is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div>
      <h2 className="font-display mb-1 text-xl text-brand-navy-900">Shipping Address</h2>
      <p className="mb-6 text-sm text-brand-gray-500">Enter the destination address for your order.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Select
            id="country"
            label="Destination Country"
            required
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value as CountryCode })}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Input
            id="addressLine1"
            label="Address Line 1"
            required
            value={form.addressLine1}
            onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
            error={errors.addressLine1}
            placeholder="Street address, P.O. box"
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            id="addressLine2"
            label="Address Line 2 (optional)"
            value={form.addressLine2 ?? ""}
            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
            placeholder="Apartment, suite, unit"
          />
        </div>
        <Input
          id="city"
          label="City"
          required
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          error={errors.city}
        />
        <Input
          id="stateProvince"
          label="State / Province"
          required
          value={form.stateProvince}
          onChange={(e) => setForm({ ...form, stateProvince: e.target.value })}
          error={errors.stateProvince}
        />
        <Input
          id="postalCode"
          label="Postal Code"
          required
          value={form.postalCode}
          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          error={errors.postalCode}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={() => {
            if (validate()) onNext(form);
          }}
        >
          Continue to Country Eligibility
        </Button>
      </div>
    </div>
  );
}
