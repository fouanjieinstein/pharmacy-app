"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Globe2 } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { getCountry } from "@/lib/data/countries";
import type { CountryCode } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function StepCountryEligibility({
  destinationCountry,
  onNext,
  onBack,
}: {
  destinationCountry: CountryCode;
  onNext: () => void;
  onBack: () => void;
}) {
  const { activeItems, productFor } = useCart();
  const country = getCountry(destinationCountry);
  const [acknowledged, setAcknowledged] = useState(false);

  const evaluations = useMemo(
    () =>
      activeItems.map((item) => {
        const product = productFor(item.productId);
        if (!product) return null;
        const inRegion = product.availableCountries.includes(destinationCountry);
        const rxOk = !product.prescriptionRequired || country.rxImportAllowed;
        return { product, quantity: item.quantity, eligible: inRegion && rxOk, inRegion, rxOk };
      }).filter((e): e is NonNullable<typeof e> => e !== null),
    [activeItems, productFor, destinationCountry, country.rxImportAllowed]
  );

  const hasRestricted = evaluations.some((e) => !e.eligible);

  return (
    <div>
      <h2 className="font-display mb-1 text-xl text-brand-navy-900">Destination Eligibility</h2>
      <p className="mb-6 text-sm text-brand-gray-500">
        We check each item in your cart against import and prescription regulations for <strong>{country.name}</strong>.
      </p>

      <div className="mb-5 flex gap-3 rounded-md border border-brand-navy-100 bg-brand-gray-50 p-4 text-sm text-brand-gray-600">
        <Globe2 className="size-5 shrink-0 text-brand-navy-700" />
        <div>
          <p className="font-medium text-brand-navy-900">Customs & Import Notice — {country.name}</p>
          <p className="mt-1 text-xs leading-relaxed">{country.customsNotice}</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {evaluations.map(({ product, quantity, eligible, rxOk }) => (
          <li key={product.id}>
            <Card>
              <CardBody className="flex items-center justify-between gap-3 py-3.5">
                <div>
                  <p className="text-sm font-medium text-brand-navy-900">
                    {product.name} <span className="text-brand-gray-400">× {quantity}</span>
                  </p>
                  {!eligible && (
                    <p className="mt-0.5 text-xs text-brand-gold-700">
                      {!rxOk
                        ? `Prescription medicines cannot currently be imported into ${country.name} on this platform.`
                        : `Not available for delivery to ${country.name}.`}
                    </p>
                  )}
                </div>
                {eligible ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-brand-emerald-700">
                    <CheckCircle2 className="size-4" /> Eligible
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <XCircle className="size-4" /> Restricted
                  </span>
                )}
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>

      {hasRestricted && (
        <div className="mt-5 flex gap-3 rounded-md border border-brand-gold-200 bg-brand-gold-50 p-4 text-sm text-brand-gold-700">
          <AlertTriangle className="size-5 shrink-0" />
          <div>
            <p className="font-medium">Some items cannot be shipped to {country.name}</p>
            <p className="mt-1 text-xs leading-relaxed">
              Restricted items will be held from this shipment. Our support team will follow up regarding
              alternatives. You may go back and change your destination country, or continue with eligible
              items only.
            </p>
            <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 size-4 rounded-sm border-brand-gray-300 text-brand-emerald-600"
              />
              I understand and wish to continue with eligible items only.
            </label>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={onNext} disabled={hasRestricted && !acknowledged}>
          Continue
        </Button>
      </div>
    </div>
  );
}
