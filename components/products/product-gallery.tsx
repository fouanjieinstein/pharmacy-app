"use client";

import { useState } from "react";
import { ProductImage } from "@/components/products/product-image";
import type { ProductGroup } from "@/types";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({ images, group, name }: { images: string[]; group: ProductGroup; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <ProductImage
        variant={images[active]}
        group={group}
        className="aspect-square w-full rounded-md border border-brand-gray-200"
        iconClassName="size-24"
      />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View ${name} image ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                "size-16 overflow-hidden rounded-sm border-2",
                active === i ? "border-brand-emerald-600" : "border-transparent"
              )}
            >
              <ProductImage variant={img} group={group} className="size-full" iconClassName="size-6" />
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-center text-[11px] text-brand-gray-400">
        Illustrative product imagery — actual packaging may vary.
      </p>
    </div>
  );
}
