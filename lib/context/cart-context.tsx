"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartLineItem, Product } from "@/types";
import { getProductBySlug, products } from "@/lib/data/products";
import { useToast } from "@/lib/context/toast-context";
import { useMembership } from "@/lib/context/membership-context";

const PLUS_DISCOUNT_PCT = 5;

interface CartContextValue {
  items: CartLineItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  activeItems: CartLineItem[];
  savedItems: CartLineItem[];
  itemCount: number;
  subtotalUsd: number;
  hasPrescriptionItems: boolean;
  productFor: (productId: string) => Product | undefined;
  unitPriceFor: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "meridian_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();
  const { isPlusMember } = useMembership();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // ignore malformed local cart data
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const productFor = (productId: string) => products.find((p) => p.id === productId);

  const addItem = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && !i.savedForLater);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && !i.savedForLater
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
    const product = productFor(productId);
    showToast(`${product?.name ?? "Item"} added to cart`, "success");
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const saveForLater = (productId: string) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, savedForLater: true } : i)));
  };

  const moveToCart = (productId: string) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, savedForLater: false } : i)));
  };

  const clearCart = () => setItems([]);

  const unitPriceFor = (productId: string) => {
    const price = productFor(productId)?.priceUsd ?? 0;
    return isPlusMember ? Math.round(price * (1 - PLUS_DISCOUNT_PCT / 100) * 100) / 100 : price;
  };

  const activeItems = items.filter((i) => !i.savedForLater);
  const savedItems = items.filter((i) => i.savedForLater);
  const itemCount = activeItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalUsd = activeItems.reduce((sum, i) => sum + unitPriceFor(i.productId) * i.quantity, 0);
  const hasPrescriptionItems = activeItems.some((i) => productFor(i.productId)?.prescriptionRequired);

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        saveForLater,
        moveToCart,
        clearCart,
        activeItems,
        savedItems,
        itemCount,
        subtotalUsd,
        hasPrescriptionItems,
        productFor,
        unitPriceFor,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { getProductBySlug };
