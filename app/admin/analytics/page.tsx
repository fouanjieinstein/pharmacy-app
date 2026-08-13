import type { Metadata } from "next";
import { dashboardStats } from "@/lib/data/admin-mock";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { BarList } from "@/components/admin/bar-list";
import { StatCard } from "@/components/admin/stat-card";
import { TrendingUp, Percent, Repeat, Timer } from "lucide-react";

export const metadata: Metadata = { title: "Admin · Analytics", robots: { index: false, follow: false } };

export default function AdminAnalyticsPage() {
  const categoryPerformance = categories
    .map((cat) => ({ label: cat.label, value: products.filter((p) => p.category === cat.id).length }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg. Order Value" value="$58.70" changePct={3.1} icon={TrendingUp} />
        <StatCard label="Conversion Rate" value="3.4%" changePct={0.6} icon={Percent} />
        <StatCard label="Repeat Purchase Rate" value="41%" changePct={2.2} icon={Repeat} />
        <StatCard label="Avg. Pharmacist Review Time" value="4.2 hrs" changePct={-8.5} icon={Timer} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarList
          title="Revenue by Month"
          items={dashboardStats.revenueByMonth.map((m) => ({ label: m.month, value: m.revenueUsd }))}
          valueFormatter={(v) => `$${v.toLocaleString()}`}
        />
        <BarList title="Product Count by Category" items={categoryPerformance} />
      </div>

      <BarList
        title="Orders by Top Destination Country"
        items={dashboardStats.topCountries.map((c) => ({ label: c.country, value: c.ordersShare }))}
        valueFormatter={(v) => `${v}%`}
      />
    </div>
  );
}
