"use client";

import { useState } from "react";
import { Minus, Plus, Heart, ShieldAlert, CheckCircle2, XCircle, Stethoscope, Crown } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";
import { useCurrency } from "@/lib/context/currency-context";
import { useCountry } from "@/lib/context/country-context";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useMemberPrice } from "@/lib/utils/use-member-price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { format } = useCurrency();
  const { countryCode, country } = useCountry();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isPlusMember, formatMemberPrice, discountPct } = useMemberPrice();

  const availableHere = product.availableCountries.includes(countryCode);
  const wishlisted = isWishlisted(product.id);
  const rxBlockedByCountry = product.prescriptionRequired && !country.rxImportAllowed;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {product.prescriptionRequired ? (
          <Badge variant="gold" icon={<Stethoscope className="size-3" />}>Prescription Required</Badge>
        ) : (
          <Badge variant="emerald">Over-the-Counter</Badge>
        )}
        {product.coldChainRequired && <Badge variant="navy">Cold-Chain Delivery</Badge>}
        <Badge variant="outline">{product.category.replace(/-/g, " ")}</Badge>
      </div>

      <h1 className="font-display text-3xl text-brand-navy-900">{product.name}</h1>
      <p className="mt-1.5 text-sm text-brand-gray-500">
        {product.genericName} · {product.activeIngredient}
      </p>
      <p className="mt-0.5 text-sm text-brand-gray-500">
        {product.dosage} · {product.form} · {product.packSize}
      </p>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-display text-3xl text-brand-navy-900">
          {isPlusMember ? formatMemberPrice(product.priceUsd) : format(product.priceUsd)}
        </span>
        {isPlusMember ? (
          <span className="text-base text-brand-gray-400 line-through">{format(product.priceUsd)}</span>
        ) : (
          product.compareAtPriceUsd && (
            <span className="text-base text-brand-gray-400 line-through">{format(product.compareAtPriceUsd)}</span>
          )
        )}
      </div>
      {isPlusMember ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-gold-700">
          <Crown className="size-3.5" /> Plus member price applied
        </p>
      ) : (
        <Link href="/plus" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-gold-700 hover:underline">
          <Crown className="size-3.5" /> Save {discountPct}% with Meridian Plus
        </Link>
      )}
      <p className="mt-1 text-xs text-brand-gray-400">Manufactured by {product.manufacturer}</p>

      <div className="mt-6 space-y-2.5 rounded-md border border-brand-gray-200 p-4 text-sm">
        <div className="flex items-center gap-2">
          {product.inStock ? (
            <>
              <CheckCircle2 className="size-4 text-brand-emerald-600" />
              <span className="text-brand-navy-900">In Stock ({product.stockCount} available)</span>
            </>
          ) : (
            <>
              <XCircle className="size-4 text-red-600" />
              <span className="text-red-600">Out of Stock</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {availableHere && !rxBlockedByCountry ? (
            <>
              <CheckCircle2 className="size-4 text-brand-emerald-600" />
              <span className="text-brand-navy-900">Ships to {country.name}</span>
            </>
          ) : (
            <>
              <ShieldAlert className="size-4 text-brand-gold-600" />
              <span className="text-brand-gold-700">
                {rxBlockedByCountry
                  ? `Prescription import restrictions apply in ${country.name} — availability will be confirmed at checkout.`
                  : `Not currently available for delivery to ${country.name}.`}
              </span>
            </>
          )}
        </div>
        {product.prescriptionRequired && (
          <p className="border-t border-brand-gray-100 pt-2.5 text-xs text-brand-gray-500">
            This medicine requires a valid prescription. It will be reviewed by a licensed pharmacist before
            fulfillment.{" "}
            <Link href="/prescription" className="font-medium text-brand-emerald-700 underline">
              Upload your prescription
            </Link>
            .
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center rounded-sm border border-brand-gray-300">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 text-brand-gray-600 hover:bg-brand-gray-50"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-3 text-brand-gray-600 hover:bg-brand-gray-50"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1"
          disabled={!product.inStock || !availableHere}
          onClick={() => addItem(product.id, quantity)}
        >
          Add to Cart
        </Button>

        <button
          onClick={() => toggleWishlist(product.id, product.name)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-brand-gray-300 text-brand-gray-500 hover:text-red-500"
        >
          <Heart className={wishlisted ? "size-5 fill-red-500 text-red-500" : "size-5"} />
        </button>
      </div>
    </div>
  );
}
