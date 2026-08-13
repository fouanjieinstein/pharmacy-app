import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { countries } from "@/lib/data/countries";
import type { Country } from "@/types";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Countries", robots: { index: false, follow: false } };

const columns: Column<Country>[] = [
  { header: "Country", cell: (c) => <span className="font-medium">{c.name}</span> },
  { header: "Region", cell: (c) => c.region },
  { header: "Delivery", cell: (c) => (c.deliveryAvailable ? <Badge variant="emerald">Available</Badge> : <Badge variant="red">Unavailable</Badge>) },
  { header: "Rx Import", cell: (c) => (c.rxImportAllowed ? <Badge variant="emerald">Allowed</Badge> : <Badge variant="gold">Restricted</Badge>) },
  { header: "Cold-Chain", cell: (c) => (c.coldChainAvailable ? "Yes" : "No") },
  { header: "Standard Delivery", cell: (c) => `${c.standardDeliveryDays[0]}–${c.standardDeliveryDays[1]} days` },
];

export default function AdminCountriesPage() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl text-brand-navy-900">Countries & Eligibility</h2>
      </div>
      <DataTable columns={columns} rows={countries.map((c) => ({ ...c, id: c.code }))} />
    </div>
  );
}
