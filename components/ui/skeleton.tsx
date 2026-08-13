import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sm bg-brand-gray-200", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-brand-gray-200">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-3 h-8 w-full" />
      </div>
    </div>
  );
}
