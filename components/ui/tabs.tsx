"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const activeItem = items.find((i) => i.id === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Product information"
        className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-brand-gray-200"
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={active === item.id}
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            onClick={() => setActive(item.id)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              active === item.id
                ? "border-brand-emerald-600 text-brand-navy-900"
                : "border-transparent text-brand-gray-500 hover:text-brand-navy-900"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="animate-fade-in py-6"
      >
        {activeItem?.content}
      </div>
    </div>
  );
}
