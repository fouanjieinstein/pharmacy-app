import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-sm", className)} />;
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

/** A single loading row matching the shape of a Card-based list item used
 * throughout /account (orders, consultations, lab bookings, prescriptions). */
export function CardRowSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-brand-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

/** A stack of `count` CardRowSkeleton rows, for list-type loading states. */
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <CardRowSkeleton key={i} />
      ))}
    </div>
  );
}
