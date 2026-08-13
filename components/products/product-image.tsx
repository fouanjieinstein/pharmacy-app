import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { ProductGroup } from "@/types";
import { PRODUCT_ILLUSTRATIONS, BlisterPackIllustration } from "@/components/products/product-illustrations";

// Real product photography (generic, unbranded stock photos — see
// public/products/README.md for sourcing/licensing notes). There is exactly
// one distinct photo per product: each form factor's pool size equals the
// number of products with that dosage form, and lib/data/products.ts assigns
// each product a unique key from its form factor's pool (e.g. "tablet-17").
// Falls back to a hand-drawn illustration for any unmapped/unknown key.
const POOL_SIZE: Record<string, number> = {
  tablet: 23,
  capsule: 10,
  syrup: 1,
  cream: 4,
  inhaler: 2,
  drops: 2,
  kit: 1,
  supplement: 1,
  injection: 6,
};

const PRODUCT_PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(POOL_SIZE).flatMap(([base, size]) =>
    Array.from({ length: size }, (_, i) => [`${base}-${i + 1}`, `/products/${base}-${i + 1}.jpg`])
  )
);

const GROUP_GRADIENT: Record<ProductGroup, string> = {
  otc: "from-brand-emerald-50 via-white to-brand-gray-50",
  prescription: "from-brand-navy-50/40 via-white to-brand-gray-50",
  wellness: "from-brand-gold-50 via-white to-brand-gray-50",
};

const GROUP_ICON_COLOR: Record<ProductGroup, string> = {
  otc: "text-brand-emerald-600",
  prescription: "text-brand-navy-700",
  wellness: "text-brand-gold-600",
};

export function ProductImage({
  variant,
  group,
  className,
  iconClassName,
}: {
  variant: string;
  group: ProductGroup;
  className?: string;
  iconClassName?: string;
}) {
  const photo = PRODUCT_PHOTOS[variant];
  const baseType = variant.replace(/-\d+$/, "");
  const Illustration = PRODUCT_ILLUSTRATIONS[baseType] ?? BlisterPackIllustration;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        GROUP_GRADIENT[group],
        className
      )}
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              color: "var(--color-navy-900)",
            }}
          />
          <Illustration className={cn("relative size-16", GROUP_ICON_COLOR[group], iconClassName)} />
        </>
      )}
    </div>
  );
}
