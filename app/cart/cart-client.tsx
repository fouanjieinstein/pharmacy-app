"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShieldAlert, ShoppingBag, BookmarkPlus, RotateCcw } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useCurrency } from "@/lib/context/currency-context";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { ProductImage } from "@/components/products/product-image";
import { EmptyState } from "@/components/ui/empty-state";

export function CartClient() {
  const {
    activeItems,
    savedItems,
    productFor,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    subtotalUsd,
    hasPrescriptionItems,
    unitPriceFor,
  } = useCart();
  const { format } = useCurrency();

  if (activeItems.length === 0 && savedItems.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-12" />}
        title="Your cart is empty"
        description="Browse our shop to add over-the-counter, prescription, or wellness products."
        action={
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Browse Shop
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        {activeItems.length > 0 && (
          <div className="space-y-4">
            {activeItems.map((item) => {
              const product = productFor(item.productId);
              if (!product) return null;
              return (
                <Card key={item.productId}>
                  <CardBody className="flex gap-4">
                    <Link href={`/products/${product.slug}`} className="shrink-0">
                      <ProductImage variant={product.images[0]} group={product.group} className="size-24 rounded-sm sm:size-28" iconClassName="size-10" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/products/${product.slug}`} className="font-medium text-brand-navy-900 hover:text-brand-emerald-700">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-brand-gray-500">{product.dosage} · {product.form} · {product.packSize}</p>
                          {product.prescriptionRequired && (
                            <Badge variant="gold" className="mt-1.5">Prescription Required</Badge>
                          )}
                        </div>
                        <span className="whitespace-nowrap font-display text-lg text-brand-navy-900">
                          {format(unitPriceFor(item.productId) * item.quantity)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-sm border border-brand-gray-300">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-brand-gray-600 hover:bg-brand-gray-50 disabled:opacity-30"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-9 text-center text-sm">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 text-brand-gray-600 hover:bg-brand-gray-50"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <button
                            onClick={() => saveForLater(item.productId)}
                            className="flex items-center gap-1 text-brand-gray-500 hover:text-brand-navy-900"
                          >
                            <BookmarkPlus className="size-3.5" /> Save for later
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="flex items-center gap-1 text-brand-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {savedItems.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display mb-4 text-lg text-brand-navy-900">Saved for Later ({savedItems.length})</h2>
            <div className="space-y-3">
              {savedItems.map((item) => {
                const product = productFor(item.productId);
                if (!product) return null;
                return (
                  <Card key={item.productId}>
                    <CardBody className="flex items-center gap-4">
                      <ProductImage variant={product.images[0]} group={product.group} className="size-16 rounded-sm" iconClassName="size-6" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-navy-900">{product.name}</p>
                        <p className="text-xs text-brand-gray-500">{format(unitPriceFor(item.productId))}</p>
                      </div>
                      <button
                        onClick={() => moveToCart(item.productId)}
                        className="flex items-center gap-1 text-xs font-medium text-brand-emerald-700 hover:underline"
                      >
                        <RotateCcw className="size-3.5" /> Move to cart
                      </button>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {activeItems.length > 0 && (
        <aside>
          <Card className="sticky top-24">
            <CardBody>
              <h2 className="font-display mb-4 text-lg text-brand-navy-900">Order Summary</h2>
              {hasPrescriptionItems && (
                <div className="mb-4 flex gap-2 rounded-sm bg-brand-gold-50 px-3 py-2.5 text-xs text-brand-gold-700">
                  <ShieldAlert className="size-4 shrink-0" />
                  <span>This order contains prescription items requiring pharmacist verification at checkout.</span>
                </div>
              )}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-brand-gray-600">
                  <span>Subtotal</span>
                  <span className="text-brand-navy-900">{format(subtotalUsd)}</span>
                </div>
                <div className="flex justify-between text-brand-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-brand-gray-600">
                  <span>Taxes / fees</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-brand-gray-200 pt-4">
                <span className="font-medium text-brand-navy-900">Estimated Total</span>
                <span className="font-display text-xl text-brand-navy-900">{format(subtotalUsd)}</span>
              </div>
              <Link href="/checkout" className={buttonVariants({ fullWidth: true, size: "lg", className: "mt-5" })}>
                Proceed to Checkout
              </Link>
            </CardBody>
          </Card>
        </aside>
      )}
    </div>
  );
}
