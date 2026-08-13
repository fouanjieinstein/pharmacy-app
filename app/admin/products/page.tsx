import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { products } from "@/lib/data/products";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Products", robots: { index: false, follow: false } };

const columns: Column<Product>[] = [
  { header: "Product", cell: (p) => <span className="font-medium">{p.name}</span> },
  { header: "Category", cell: (p) => <span className="capitalize">{p.category.replace(/-/g, " ")}</span> },
  { header: "Group", cell: (p) => <Badge variant={p.group === "prescription" ? "gold" : p.group === "wellness" ? "navy" : "emerald"}>{p.group}</Badge> },
  { header: "Price (USD)", cell: (p) => `$${p.priceUsd.toFixed(2)}` },
  { header: "Stock", cell: (p) => (p.stockCount < 60 ? <span className="font-medium text-brand-gold-600">{p.stockCount}</span> : p.stockCount) },
  { header: "Rx Required", cell: (p) => (p.prescriptionRequired ? "Yes" : "No") },
  { header: "Status", cell: (p) => (p.inStock ? <Badge variant="emerald">In Stock</Badge> : <Badge variant="red">Out of Stock</Badge>) },
];

export default function AdminProductsPage() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy-900">Products</h2>
        <p className="text-sm text-brand-gray-500">{products.length} total products</p>
      </div>
      <DataTable columns={columns} rows={products} />
    </div>
  );
}
