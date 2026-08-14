"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types";
import { useCurrency } from "@/lib/context/currency-context";
import { useCountry } from "@/lib/context/country-context";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useMemberPrice } from "@/lib/utils/use-member-price";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/products/product-image";
import { cn } from "@/lib/utils/cn";

export function ProductCard({ product }: { product: Product }) {
  const { format } = useCurrency();
  const { countryCode } = useCountry();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isPlusMember, formatMemberPrice } = useMemberPrice();
  const [wishlistPop, setWishlistPop] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const availableHere = product.availableCountries.includes(countryCode);
  const wishlisted = isWishlisted(product.id);

  const handleToggleWishlist = () => {
    if (!wishlisted) {
      setWishlistPop(true);
      setTimeout(() => setWishlistPop(false), 300);
    }
    toggleWishlist(product.id, product.name);
  };

  const handleAddItem = () => {
    addItem(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-brand-gray-200 bg-white transition-shadow hover:shadow-lg">
      <button
        onClick={handleToggleWishlist}
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
        className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-brand-gray-500 shadow-sm transition-transform hover:text-red-500 active:scale-90"
      >
        <Heart className={cn("size-4", wishlisted && "fill-red-500 text-red-500", wishlistPop && "animate-pop")} />
      </button>

      <Link href={`/products/${product.slug}`} className="block">
        <ProductImage variant={product.images[0]} group={product.group} className="h-48 w-full" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {product.sponsored && <Badge variant="gray">Sponsored</Badge>}
          {product.prescriptionRequired ? (
            <Badge variant="gold">Prescription Required</Badge>
          ) : (
            <Badge variant="emerald">OTC</Badge>
          )}
          {!availableHere && <Badge variant="red">Not available in your region</Badge>}
        </div>

        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-brand-navy-900 hover:text-brand-emerald-700">
          {product.name}
        </Link>
        <p className="mt-0.5 line-clamp-1 text-xs text-brand-gray-500">{product.activeIngredient}</p>
        <p className="mt-0.5 text-xs text-brand-gray-500">{product.dosage} · {product.form}</p>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-brand-gray-500">
          <Star className="size-3.5 fill-brand-gold-500 text-brand-gold-500" />
          {product.rating.toFixed(1)}
          <span className="text-brand-gray-400">({product.reviewCount})</span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {isPlusMember ? (
              <div className="flex items-center gap-1.5">
                <p className="font-display text-lg text-brand-navy-900">{formatMemberPrice(product.priceUsd)}</p>
                <p className="text-xs text-brand-gray-400 line-through">{format(product.priceUsd)}</p>
              </div>
            ) : (
              <p className="font-display text-lg text-brand-navy-900">{format(product.priceUsd)}</p>
            )}
            {!product.inStock && <p className="text-xs font-medium text-red-600">Out of Stock</p>}
          </div>
          <button
            onClick={handleAddItem}
            disabled={!product.inStock || !availableHere}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "flex size-10 items-center justify-center rounded-sm text-white transition-all duration-150 ease-out active:scale-90 disabled:cursor-not-allowed disabled:bg-brand-gray-300",
              justAdded ? "bg-brand-emerald-600" : "bg-brand-navy-900 hover:bg-brand-emerald-700"
            )}
          >
            {justAdded ? <Check className="size-4.5 animate-pop" /> : <ShoppingBag className="size-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
