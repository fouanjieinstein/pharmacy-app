"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { X, User, ShoppingBag, LayoutDashboard, Crown } from "lucide-react";
import { NAV_LINKS } from "@/components/navigation/nav-links";
import { CurrencySelector } from "@/components/navigation/currency-selector";
import { CountrySelector } from "@/components/navigation/country-selector";
import { SearchBar } from "@/components/navigation/search-bar";
import { Logo } from "@/components/navigation/logo";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-100 bg-brand-navy-950/50 animate-fade-in lg:hidden">
      <div className="flex h-full w-full max-w-xs flex-col bg-white shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-brand-gray-200 px-5 py-4">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="rounded-full p-1.5 text-brand-gray-500 hover:bg-brand-gray-100">
            <X className="size-5" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
          <SearchBar className="mb-6" onSubmit={onClose} />

          <nav className="flex flex-col" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="border-b border-brand-gray-100 py-3.5 text-base font-medium text-brand-navy-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/plus" onClick={onClose} className="flex items-center gap-2.5 py-2 text-sm font-semibold text-brand-gold-700">
              <Crown className="size-4.5" /> Meridian Plus
            </Link>
            <Link href="/account" onClick={onClose} className="flex items-center gap-2.5 py-2 text-sm font-medium text-brand-navy-900">
              <User className="size-4.5 text-brand-gray-500" /> My Account
            </Link>
            <Link href="/account/orders" onClick={onClose} className="flex items-center gap-2.5 py-2 text-sm font-medium text-brand-navy-900">
              <ShoppingBag className="size-4.5 text-brand-gray-500" /> My Orders
            </Link>
            <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5 py-2 text-sm font-medium text-brand-navy-900">
              <LayoutDashboard className="size-4.5 text-brand-gray-500" /> Admin Dashboard
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-brand-gray-100 pt-5">
            <CurrencySelector />
            <CountrySelector />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
