"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const NOTIFICATION_OPTIONS = [
  { id: "orderUpdates", label: "Order & Delivery Updates", description: "Status changes for your orders, from processing to delivery." },
  { id: "prescriptionUpdates", label: "Prescription Review Updates", description: "Notify me when a pharmacist reviews my prescription." },
  { id: "priceAlerts", label: "Price & Stock Alerts", description: "Notify me about price changes or restocks on wishlist items." },
  { id: "promotions", label: "Offers & Newsletters", description: "Occasional emails about new products and wellness content." },
] as const;

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orderUpdates: true,
    prescriptionUpdates: true,
    priceAlerts: false,
    promotions: false,
  });

  return (
    <Card>
      <CardBody>
        <h2 className="font-display mb-1 text-lg text-brand-navy-900">Notification Preferences</h2>
        <p className="mb-5 text-xs text-brand-gray-500">Choose what you&apos;d like to be notified about.</p>
        <div className="divide-y divide-brand-gray-100">
          {NOTIFICATION_OPTIONS.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-brand-navy-900">{opt.label}</p>
                <p className="text-xs text-brand-gray-500">{opt.description}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs[opt.id]}
                aria-label={opt.label}
                onClick={() => setPrefs((p) => ({ ...p, [opt.id]: !p[opt.id] }))}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  prefs[opt.id] ? "bg-brand-emerald-600" : "bg-brand-gray-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                    prefs[opt.id] ? "translate-x-[22px]" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
