import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminPrescriptionReviews, type AdminPrescriptionReview } from "@/lib/data/admin-mock";
import { PrescriptionStatusBadge } from "@/components/prescription/status-badge";

export const metadata: Metadata = { title: "Admin · Prescriptions", robots: { index: false, follow: false } };

const columns: Column<AdminPrescriptionReview>[] = [
  { header: "Patient", cell: (r) => <span className="font-medium">{r.patientName}</span> },
  { header: "File", cell: (r) => r.fileName },
  { header: "Medication", cell: (r) => r.medication },
  { header: "Submitted", cell: (r) => new Date(r.submittedAt).toLocaleString() },
  { header: "Assigned Pharmacist", cell: (r) => r.assignedPharmacist ?? "Unassigned" },
  { header: "Status", cell: (r) => <PrescriptionStatusBadge status={r.status} /> },
];

export default function AdminPrescriptionsPage() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy-900">Prescriptions</h2>
        <p className="text-sm text-brand-gray-500">Full submission repository — see Pharmacist Reviews for the action queue</p>
      </div>
      <DataTable columns={columns} rows={adminPrescriptionReviews} />
    </div>
  );
}
