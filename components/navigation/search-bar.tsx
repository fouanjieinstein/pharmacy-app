"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ className, onSubmit }: { className?: string; onSubmit?: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={className}>
      <label htmlFor="site-search" className="sr-only">
        Search medicines and health products
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-gray-400" />
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicines, ingredients, conditions…"
          className="h-11 w-full rounded-sm border border-brand-gray-300 bg-white pl-10 pr-4 text-sm text-brand-navy-900 placeholder:text-brand-gray-500 focus:border-brand-navy-900 focus:outline-none"
        />
      </div>
    </form>
  );
}
