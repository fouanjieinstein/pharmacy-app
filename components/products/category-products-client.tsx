"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductSort, sortProducts, type SortOption } from "@/components/products/product-sort";

export function CategoryProductsClient({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortOption>("featured");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-brand-gray-500">{sorted.length} products</p>
        <ProductSort value={sort} onChange={setSort} />
      </div>
      <ProductGrid products={sorted} />
    </div>
  );
}
