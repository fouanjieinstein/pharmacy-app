"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = question.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="border-b border-brand-gray-200 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`accordion-${id}`}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-brand-navy-900">{question}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-brand-gray-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id={`accordion-${id}`} className="mt-3 animate-fade-in text-sm leading-relaxed text-brand-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-brand-gray-200">{children}</div>;
}
