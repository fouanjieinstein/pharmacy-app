import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminRefunds, type AdminRefund } from "@/lib/data/admin-mock";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Refunds", robots: { index: false, follow: false } };

const STATUS_VARIANT = {
  requested: "gold",
  processing: "navy",
  completed: "emerald",
  denied: "red",
} as const;

const columns: Column<AdminRefund>[] = [
  { header: "Order #", cell: (r) => <span className="font-medium">{r.orderNumber}</span> },
  { header: "Amount", cell: (r) => `$${r.amountUsd.toFixed(2)}` },
  { header: "Reason", cell: (r) => r.reason },
  { header: "Status", cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge> },
  { header: "Requested", cell: (r) => new Date(r.requestedAt).toLocaleDateString() },
];

export default function AdminRefundsPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Refunds</h2>
      <DataTable columns={columns} rows={adminRefunds} />
    </div>
  );
}
