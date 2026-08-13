"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, FileText, Settings, User, Stethoscope, FlaskConical, LogOut } from "lucide-react";
import { useAuth, useAuthUser } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/account/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/account/consultations", label: "Consultations", icon: Stethoscope },
  { href: "/account/lab-bookings", label: "Lab Bookings", icon: FlaskConical },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="lg:w-60 lg:shrink-0">
      <div className="mb-6 rounded-md border border-brand-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-navy-900 text-white">
            <User className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-navy-900">{user.name}</p>
            <p className="truncate text-xs text-brand-gray-500">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" fullWidth className="mt-4" onClick={handleLogout}>
          <LogOut className="size-3.5" /> Sign Out
        </Button>
      </div>
      <nav aria-label="Account navigation" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
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
              <link.icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
