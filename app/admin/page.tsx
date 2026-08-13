import type { Metadata } from "next";
import { DollarSign, ShoppingCart, Users, FileWarning, Crown, CalendarClock, FlaskConical } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { BarList } from "@/components/admin/bar-list";
import { DataTable, type Column } from "@/components/admin/data-table";
import { dashboardStats, adminOrders, type AdminOrderRow } from "@/lib/data/admin-mock";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

const columns: Column<AdminOrderRow>[] = [
  { header: "Order #", cell: (r) => <span className="font-medium">{r.orderNumber}</span> },
  { header: "Customer", cell: (r) => r.customerName },
  { header: "Country", cell: (r) => r.country },
  { header: "Total", cell: (r) => `$${r.totalUsd.toFixed(2)}` },
  { header: "Status", cell: (r) => <Badge variant="emerald">{r.status}</Badge> },
  { header: "Rx", cell: (r) => (r.hasRx ? <Badge variant="gold">Yes</Badge> : "—") },
];

export default function AdminDashboardPage() {
  const s = dashboardStats;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${s.totalRevenueUsd.toLocaleString()}`} changePct={s.revenueChangePct} icon={DollarSign} />
        <StatCard label="Total Orders" value={s.totalOrders.toLocaleString()} changePct={s.ordersChangePct} icon={ShoppingCart} />
        <StatCard label="Active Customers" value={s.activeCustomers.toLocaleString()} changePct={s.customersChangePct} icon={Users} />
        <StatCard label="Pending Rx Reviews" value={String(s.pendingPrescriptionReviews)} icon={FileWarning} />
        <StatCard label="Plus Members" value={s.plusMembers.toLocaleString()} changePct={s.plusMembersChangePct} icon={Crown} />
        <StatCard label="Scheduled Consultations" value={String(s.scheduledConsultations)} icon={CalendarClock} />
        <StatCard label="Active Lab Bookings" value={String(s.activeLabBookings)} icon={FlaskConical} />
        <StatCard label="Lab Revenue" value={`$${s.labRevenueUsd.toLocaleString()}`} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarList
          title="Revenue by Month"
          items={s.revenueByMonth.map((m) => ({ label: m.month, value: m.revenueUsd }))}
          valueFormatter={(v) => `$${v.toLocaleString()}`}
        />
        <BarList
          title="Orders by Status"
          items={s.ordersByStatus.map((o) => ({ label: o.status, value: o.count }))}
        />
      </div>

      <BarList
        title="Orders by Top Destination Country"
        items={s.topCountries.map((c) => ({ label: c.country, value: c.ordersShare }))}
        valueFormatter={(v) => `${v}%`}
      />

      <div>
        <h2 className="font-display mb-4 text-lg text-brand-navy-900">Recent Orders</h2>
        <DataTable columns={columns} rows={adminOrders.map((o) => ({ ...o, id: o.id }))} />
      </div>
    </div>
  );
}
