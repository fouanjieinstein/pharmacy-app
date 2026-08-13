"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/lib/context/toast-context";
import { CurrencyProvider } from "@/lib/context/currency-context";
import { CountryProvider } from "@/lib/context/country-context";
import { CartProvider } from "@/lib/context/cart-context";
import { WishlistProvider } from "@/lib/context/wishlist-context";
import { AuthProvider, type SessionUser } from "@/lib/context/auth-context";
import { MembershipProvider } from "@/lib/context/membership-context";
import { ToastViewport } from "@/components/ui/toast-viewport";

export function AppProviders({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  return (
    <ToastProvider>
      <AuthProvider initialUser={initialUser}>
        <CurrencyProvider>
          <CountryProvider>
            <MembershipProvider>
              <WishlistProvider>
                <CartProvider>
                  {children}
                  <ToastViewport />
                </CartProvider>
              </WishlistProvider>
            </MembershipProvider>
          </CountryProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
