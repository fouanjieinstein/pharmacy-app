"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, User, ShoppingBag, Truck, ShieldCheck, Crown } from "lucide-react";
import { Logo } from "@/components/navigation/logo";
import { NAV_LINKS } from "@/components/navigation/nav-links";
import { CurrencySelector } from "@/components/navigation/currency-selector";
import { CountrySelector } from "@/components/navigation/country-selector";
import { SearchBar } from "@/components/navigation/search-bar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { CartDrawer } from "@/components/navigation/cart-drawer";
import { useCart } from "@/lib/context/cart-context";
import { useMembership } from "@/lib/context/membership-context";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { isPlusMember } = useMembership();
  const pathname = usePathname();

  return (
    <>
      <div className="bg-brand-navy-900 px-4 py-2 text-center text-xs font-medium text-white">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="size-3.5 text-brand-emerald-400" />
          International Delivery Available
          <span className="hidden text-brand-gray-300 sm:inline"> — eligibility varies by destination country</span>
        </span>
      </div>

      <header className="sticky top-0 z-40 border-b border-brand-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-sm p-1.5 text-brand-navy-900 hover:bg-brand-gray-100 lg:hidden"
          >
            <Menu className="size-6" />
          </button>

          <Logo />

          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-brand-emerald-700" : "text-brand-navy-900 hover:text-brand-emerald-700"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/plus"
              className={cn(
                "ml-1 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                isPlusMember
                  ? "bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 text-white"
                  : "bg-brand-gold-50 text-brand-gold-700 hover:bg-brand-gold-100"
              )}
            >
              <Crown className="size-3.5" /> Plus
            </Link>
          </nav>

          <div className="hidden flex-1 max-w-xs xl:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              className="rounded-sm p-2 text-brand-navy-900 hover:bg-brand-gray-100 xl:hidden"
            >
              <Search className="size-5" />
            </button>

            <div className="hidden items-center gap-1 md:flex">
              <CurrencySelector />
              <CountrySelector />
            </div>

            <Link href="/account" aria-label="My account" className="relative rounded-sm p-2 text-brand-navy-900 hover:bg-brand-gray-100">
              <User className="size-5" />
              {isPlusMember && <span className="absolute right-1 top-1 size-2 rounded-full bg-brand-gold-500" />}
            </Link>

            <button onClick={openDrawer} aria-label={`Cart, ${itemCount} items`} className="relative rounded-sm p-2 text-brand-navy-900 hover:bg-brand-gray-100">
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-brand-emerald-600 text-[10px] font-semibold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-brand-gray-200 px-4 py-3 xl:hidden">
            <SearchBar onSubmit={() => setSearchOpen(false)} />
          </div>
        )}

        <div className="hidden items-center justify-center gap-6 border-t border-brand-gray-100 bg-brand-gray-50 px-4 py-1.5 text-[11px] text-brand-gray-500 md:flex">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="size-3" /> Licensed Pharmacy</span>
          <span>Secure Checkout</span>
          <span>Pharmacist-Reviewed Prescriptions</span>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer />
    </>
  );
}
