"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useCart } from "@/lib/context/cart-context";
import { useCurrency } from "@/lib/context/currency-context";
import { products } from "@/lib/data/products";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/products/product-image";
import { EmptyState } from "@/components/ui/empty-state";

export function WishlistTab() {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { format } = useCurrency();

  const wishlistProducts = items
    .map((i) => products.find((p) => p.id === i.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Card>
      <CardBody>
        <h2 className="font-display mb-4 text-lg text-brand-navy-900">Wishlist</h2>
        {wishlistProducts.length === 0 ? (
          <EmptyState icon={<Heart className="size-10" />} title="Your wishlist is empty" description="Save products you're interested in for later." />
        ) : (
          <div className="space-y-3">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 rounded-md border border-brand-gray-200 p-4">
                <Link href={`/products/${product.slug}`}>
                  <ProductImage variant={product.images[0]} group={product.group} className="size-16 rounded-sm" iconClassName="size-6" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.slug}`} className="text-sm font-medium text-brand-navy-900 hover:text-brand-emerald-700">
                    {product.name}
                  </Link>
                  <p className="text-xs text-brand-gray-500">{format(product.priceUsd)}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => addItem(product.id)}>
                  Add to Cart
                </Button>
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="text-brand-gray-400 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
