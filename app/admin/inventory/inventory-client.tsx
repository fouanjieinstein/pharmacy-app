"use client";

import { AlertTriangle } from "lucide-react";
import { products } from "@/lib/data/products";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/context/toast-context";
import type { Product } from "@/types";

const LOW_STOCK_THRESHOLD = 80;

export function InventoryClient() {
  const { showToast } = useToast();
  const sorted = [...products].sort((a, b) => a.stockCount - b.stockCount);

  const columns: Column<Product>[] = [
    { header: "Product", cell: (p) => <span className="font-medium">{p.name}</span> },
    { header: "SKU", cell: (p) => <span className="font-mono text-xs text-brand-gray-500">{p.id.toUpperCase()}</span> },
    { header: "Stock Level", cell: (p) => p.stockCount },
    {
      header: "Status",
      cell: (p) =>
        p.stockCount < LOW_STOCK_THRESHOLD ? (
          <Badge variant="gold" icon={<AlertTriangle className="size-3" />}>Low Stock</Badge>
        ) : (
          <Badge variant="emerald">Healthy</Badge>
        ),
    },
    {
      header: "Action",
      cell: (p) => (
        <Button size="sm" variant="outline" onClick={() => showToast(`Reorder request queued for ${p.name}.`, "info")}>
          Reorder
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} rows={sorted} />;
}
