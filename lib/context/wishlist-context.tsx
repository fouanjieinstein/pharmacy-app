"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WishlistItem } from "@/types";
import { useToast } from "@/lib/context/toast-context";
import { useAuth } from "@/lib/context/auth-context";

// Wishlist is now server-backed (wishlist_items table, GET/POST
// /api/wishlist) — tied to the account, not the browser. Signed-out visitors
// can't wishlist items; previously this worked for anyone via localStorage,
// but there's no user to attach a server-side record to until they sign in.

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isSignedIn) {
      setItems([]);
      return;
    }
    fetch("/api/wishlist", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]));
  }, [isSignedIn]);

  const isWishlisted = (productId: string) => items.some((i) => i.productId === productId);

  const toggleWishlist = (productId: string, productName?: string) => {
    if (!isSignedIn) {
      showToast("Sign in to save items to your wishlist.", "info");
      return;
    }

    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Couldn't update your wishlist.");
        setItems(data.items);
        showToast(
          data.wishlisted ? `${productName ?? "Item"} added to wishlist` : `${productName ?? "Item"} removed from wishlist`,
          data.wishlisted ? "success" : "info"
        );
      })
      .catch((err) => showToast(err instanceof Error ? err.message : "Couldn't update your wishlist.", "error"));
  };

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
