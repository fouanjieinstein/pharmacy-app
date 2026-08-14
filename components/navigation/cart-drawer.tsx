"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShieldAlert, ShoppingBag } from "lucide-react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/context/cart-context";
import { useCurrency } from "@/lib/context/currency-context";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/products/product-image";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/cn";
import { useExitTransition } from "@/lib/utils/use-exit-transition";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, activeItems, productFor, updateQuantity, removeItem, subtotalUsd, hasPrescriptionItems, unitPriceFor } =
    useCart();
  const { format } = useCurrency();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  const shouldRender = useExitTransition(isDrawerOpen, 180);
  if (!shouldRender || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-100 flex justify-end bg-brand-navy-950/50",
        isDrawerOpen ? "animate-fade-in" : "animate-fade-out"
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "flex h-full w-full max-w-md flex-col bg-white shadow-2xl",
          isDrawerOpen ? "animate-slide-up" : "animate-slide-down"
        )}
      >
        <div className="flex items-center justify-between border-b border-brand-gray-200 px-6 py-5">
          <h2 className="font-display text-xl text-brand-navy-900">Your Cart</h2>
          <button onClick={closeDrawer} aria-label="Close cart" className="rounded-full p-1.5 text-brand-gray-500 hover:bg-brand-gray-100">
            <X className="size-5" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-4">
          {activeItems.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="size-10" />}
              title="Your cart is empty"
              description="Browse our shop to add medicines and wellness products."
              action={
                <Link href="/shop" onClick={closeDrawer} className={buttonVariants({ variant: "outline" })}>
                  Browse Shop
                </Link>
              }
            />
          ) : (
            <ul className="space-y-5">
              {activeItems.map((item) => {
                const product = productFor(item.productId);
                if (!product) return null;
                return (
                  <li key={item.productId} className="flex gap-3">
                    <Link href={`/products/${product.slug}`} onClick={closeDrawer} className="shrink-0">
                      <ProductImage variant={product.images[0]} group={product.group} className="size-20 rounded-sm" iconClassName="size-8" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.slug}`} onClick={closeDrawer} className="line-clamp-1 text-sm font-medium text-brand-navy-900 hover:text-brand-emerald-700">
                        {product.name}
                      </Link>
                      <p className="text-xs text-brand-gray-500">{product.dosage} · {product.form}</p>
                      {product.prescriptionRequired && (
                        <Badge variant="gold" className="mt-1">Prescription Required</Badge>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-sm border border-brand-gray-300">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 text-brand-gray-600 hover:bg-brand-gray-50 disabled:opacity-30"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 text-brand-gray-600 hover:bg-brand-gray-50"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-brand-navy-900">
                          {format(unitPriceFor(item.productId) * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-label={`Remove ${product.name} from cart`}
                      onClick={() => removeItem(item.productId)}
                      className="self-start text-brand-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {activeItems.length > 0 && (
          <div className="border-t border-brand-gray-200 px-6 py-5">
            {hasPrescriptionItems && (
              <div className="mb-4 flex gap-2 rounded-sm bg-brand-gold-50 px-3 py-2.5 text-xs text-brand-gold-700">
                <ShieldAlert className="size-4 shrink-0" />
                <span>Your cart contains prescription items. You&apos;ll upload and verify your prescription at checkout.</span>
              </div>
            )}
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-brand-gray-600">Subtotal</span>
              <span className="font-display text-lg text-brand-navy-900">{format(subtotalUsd)}</span>
            </div>
            <p className="mb-4 text-xs text-brand-gray-500">Shipping, customs notices, and taxes are calculated at checkout based on destination country.</p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={closeDrawer} className={buttonVariants({ size: "lg", fullWidth: true })}>
                Proceed to Checkout
              </Link>
              <Link href="/cart" onClick={closeDrawer} className={buttonVariants({ variant: "outline", fullWidth: true })}>
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
