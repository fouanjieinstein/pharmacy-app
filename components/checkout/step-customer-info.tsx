"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export function StepCustomerInfo({
  value,
  onNext,
}: {
  value: CustomerInfo;
  onNext: (data: CustomerInfo) => void;
}) {
  const [form, setForm] = useState(value);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const validate = () => {
    const next: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 7) next.phone = "Enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div>
      <h2 className="font-display mb-1 text-xl text-brand-navy-900">Confirm Your Details</h2>
      <p className="mb-6 text-sm text-brand-gray-500">Confirm your contact details for this order.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            id="fullName"
            label="Full Name"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
            placeholder="Jane Doe"
          />
        </div>
        <Input
          id="email"
          type="email"
          label="Email Address"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="jane@example.com"
        />
        <Input
          id="phone"
          type="tel"
          label="Phone Number"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          onClick={() => {
            if (validate()) onNext(form);
          }}
        >
          Continue to Shipping Address
        </Button>
      </div>
    </div>
  );
}
