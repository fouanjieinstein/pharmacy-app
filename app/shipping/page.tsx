import type { Metadata } from "next";
import { Truck, Zap, Snowflake, Globe2 } from "lucide-react";
import { countries } from "@/lib/data/countries";
import { DataTable, type Column } from "@/components/admin/data-table";
import type { Country } from "@/types";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "International shipping methods, delivery estimates, and destination-country eligibility.",
};

const methods = [
  { icon: Truck, name: "Standard International", price: "$9.99", description: "Our default tracked international delivery option." },
  { icon: Zap, name: "Express International", price: "$24.99", description: "Priority handling and expedited transit for faster delivery." },
  { icon: Snowflake, name: "Cold-Chain Delivery", price: "$39.99", description: "Temperature-controlled packaging for cold-chain-sensitive medicines, where supported." },
];

const columns: Column<Country>[] = [
  { header: "Country", cell: (c) => <span className="font-medium">{c.name}</span> },
  { header: "Delivery", cell: (c) => (c.deliveryAvailable ? <Badge variant="emerald">Available</Badge> : <Badge variant="red">Unavailable</Badge>) },
  { header: "Prescription Import", cell: (c) => (c.rxImportAllowed ? <Badge variant="emerald">Allowed</Badge> : <Badge variant="gold">Restricted</Badge>) },
  { header: "Standard Delivery", cell: (c) => `${c.standardDeliveryDays[0]}–${c.standardDeliveryDays[1]} business days` },
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Shipping</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">International Delivery Available</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-gray-600">
        We ship to a range of eligible destination countries. Availability depends on destination-country
        laws, prescription requirements, import restrictions, product classification, and customs
        regulations. We do not ship every medication to every country — eligibility is checked for your
        specific cart and destination at checkout.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {methods.map((m) => (
          <div key={m.name} className="rounded-md border border-brand-gray-200 p-5">
            <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
              <m.icon className="size-5" />
            </span>
            <p className="text-sm font-semibold text-brand-navy-900">{m.name}</p>
            <p className="font-display mt-1 text-lg text-brand-navy-900">{m.price}</p>
            <p className="mt-2 text-xs text-brand-gray-500">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Globe2 className="size-4.5 text-brand-navy-700" />
          <h2 className="text-base font-semibold text-brand-navy-900">Destination Country Eligibility</h2>
        </div>
        <DataTable columns={columns} rows={countries.map((c) => ({ ...c, id: c.code }))} />
      </div>

      <div className="mt-8 rounded-md border border-brand-gray-200 bg-brand-gray-50 p-5 text-xs leading-relaxed text-brand-gray-500">
        Customs duties, import taxes, and any additional destination-country fees are the responsibility of
        the customer unless otherwise stated. Delivery estimates are illustrative and may vary due to
        customs processing.
      </div>
    </div>
  );
}
