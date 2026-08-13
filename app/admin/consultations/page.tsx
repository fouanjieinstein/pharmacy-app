import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminConsultations, type AdminConsultation } from "@/lib/data/admin-mock";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Consultations", robots: { index: false, follow: false } };

const STATUS_VARIANT = {
  scheduled: "emerald",
  completed: "navy",
  cancelled: "red",
} as const;

const columns: Column<AdminConsultation>[] = [
  { header: "Patient", cell: (c) => <span className="font-medium">{c.patientName}</span> },
  { header: "Doctor", cell: (c) => c.doctorName },
  { header: "Specialty", cell: (c) => c.specialty },
  { header: "Slot", cell: (c) => new Date(c.slot).toLocaleString() },
  { header: "Fee", cell: (c) => `$${c.feeUsd.toFixed(2)}` },
  { header: "Status", cell: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge> },
];

export default function AdminConsultationsPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Consultations</h2>
      <DataTable columns={columns} rows={adminConsultations} />
    </div>
  );
}
