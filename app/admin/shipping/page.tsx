import type { Metadata } from "next";
import { Truck, Zap, Snowflake } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin · Shipping", robots: { index: false, follow: false } };

const methods = [
  { icon: Truck, name: "Standard International", price: "$9.99", note: "Available for all eligible destinations." },
  { icon: Zap, name: "Express International", price: "$24.99", note: "Priority handling and expedited transit." },
  { icon: Snowflake, name: "Cold-Chain Delivery", price: "$39.99", note: "Temperature-controlled — only offered where destination infrastructure supports it." },
];

export default function AdminShippingPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Shipping Methods</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {methods.map((m) => (
          <Card key={m.name}>
            <CardBody>
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
                <m.icon className="size-5" />
              </span>
              <p className="text-sm font-semibold text-brand-navy-900">{m.name}</p>
              <p className="font-display mt-1 text-xl text-brand-navy-900">{m.price}</p>
              <p className="mt-2 text-xs text-brand-gray-500">{m.note}</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="mt-8 rounded-md border border-brand-gray-200 bg-brand-gray-50 p-5 text-sm text-brand-gray-600">
        <p className="font-medium text-brand-navy-900">Logistics Integration</p>
        <p className="mt-1.5 text-xs leading-relaxed">
          In production, shipping rates and transit estimates would be sourced live from the international
          logistics provider&apos;s API (e.g. rate shopping across DHL, FedEx, or a regional pharma-logistics
          partner), with cold-chain routing validated against destination infrastructure before checkout.
        </p>
      </div>
    </div>
  );
}
