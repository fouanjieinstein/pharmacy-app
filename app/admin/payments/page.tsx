import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminPayments, type AdminPayment } from "@/lib/data/admin-mock";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Payments", robots: { index: false, follow: false } };

const STATUS_VARIANT = {
  succeeded: "emerald",
  failed: "red",
  pending: "gold",
  refunded: "navy",
} as const;

const columns: Column<AdminPayment>[] = [
  { header: "Order #", cell: (p) => <span className="font-medium">{p.orderNumber}</span> },
  { header: "Provider", cell: (p) => p.provider },
  { header: "Card", cell: (p) => <span className="capitalize">{p.brand} •••• {p.last4}</span> },
  { header: "Amount", cell: (p) => `${p.amountUsd.toFixed(2)} ${p.currency}` },
  { header: "Status", cell: (p) => <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge> },
  { header: "Timestamp", cell: (p) => new Date(p.timestamp).toLocaleString() },
];

export default function AdminPaymentsPage() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl text-brand-navy-900">Payments</h2>
        <p className="mt-1 text-xs text-brand-gray-500">
          Transaction metadata only — raw card numbers and CVV are never stored, per PCI-DSS scope reduction.
        </p>
      </div>
      <DataTable columns={columns} rows={adminPayments} />
    </div>
  );
}
