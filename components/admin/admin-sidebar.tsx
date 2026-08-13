"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  FileText,
  Stethoscope,
  CreditCard,
  RotateCcw,
  Truck,
  Globe,
  BarChart3,
  Settings,
  CalendarClock,
  Crown,
  FlaskConical,
  TestTubes,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/admin/pharmacist-reviews", label: "Pharmacist Reviews", icon: Stethoscope },
  { href: "/admin/consultations", label: "Consultations", icon: CalendarClock },
  { href: "/admin/lab-tests", label: "Lab Tests", icon: TestTubes },
  { href: "/admin/lab-bookings", label: "Lab Bookings", icon: FlaskConical },
  { href: "/admin/plus-members", label: "Plus Members", icon: Crown },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/refunds", label: "Refunds", icon: RotateCcw },
  { href: "/admin/shipping", label: "Shipping", icon: Truck },
  { href: "/admin/countries", label: "Countries", icon: Globe },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:w-64 lg:shrink-0">
      <nav aria-label="Admin navigation" className="scrollbar-thin flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-navy-900 text-white" : "text-brand-navy-900 hover:bg-brand-gray-100"
              )}
            >
              <link.icon className="size-4 shrink-0" />
              <span className="whitespace-nowrap">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
