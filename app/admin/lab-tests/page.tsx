import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { labTests, getLabCategoryMeta, SAMPLE_TYPE_LABELS } from "@/lib/data/lab-tests";
import type { LabTest } from "@/types";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Lab Tests", robots: { index: false, follow: false } };

const columns: Column<LabTest>[] = [
  { header: "Test", cell: (t) => <span className="font-medium">{t.shortName}</span> },
  { header: "Category", cell: (t) => getLabCategoryMeta(t.category)?.label ?? t.category },
  { header: "Sample", cell: (t) => SAMPLE_TYPE_LABELS[t.sampleType] },
  { header: "Turnaround", cell: (t) => `${t.turnaroundDays[0]}–${t.turnaroundDays[1]}d` },
  { header: "Price", cell: (t) => `$${t.priceUsd.toFixed(2)}` },
  { header: "Referral", cell: (t) => (t.requiresReferral ? <Badge variant="gold">Required</Badge> : "—") },
  { header: "Home Collection", cell: (t) => (t.homeCollectionAvailable ? "Yes" : "No") },
];

export default function AdminLabTestsPage() {
  const sorted = [...labTests].sort((a, b) => b.priceUsd - a.priceUsd);
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy-900">Lab Test Catalogue</h2>
        <p className="text-sm text-brand-gray-500">{labTests.length} tests</p>
      </div>
      <DataTable columns={columns} rows={sorted} />
    </div>
  );
}
