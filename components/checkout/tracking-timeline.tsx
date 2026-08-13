import { Check } from "lucide-react";
import type { OrderTrackingEvent } from "@/types";
import { cn } from "@/lib/utils/cn";

export function TrackingTimeline({ events }: { events: OrderTrackingEvent[] }) {
  return (
    <ol className="relative ml-3 space-y-8 border-l-2 border-brand-gray-200 pl-8">
      {events.map((event, i) => {
        const isCurrent = event.completed && (i === events.length - 1 || !events[i + 1]?.completed);
        return (
          <li key={event.status} className="relative">
            <span
              className={cn(
                "absolute -left-[41px] flex size-6 items-center justify-center rounded-full ring-4 ring-white",
                event.completed ? "bg-brand-emerald-600 text-white" : "bg-brand-gray-200 text-brand-gray-400"
              )}
            >
              {event.completed ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
            </span>
            <div>
              <p className={cn("text-sm font-semibold", event.completed ? "text-brand-navy-900" : "text-brand-gray-400")}>
                {event.label}
                {isCurrent && (
                  <span className="ml-2 rounded-full bg-brand-emerald-50 px-2 py-0.5 text-[10px] font-medium text-brand-emerald-700">
                    Current Status
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-brand-gray-500">{event.description}</p>
              {event.timestamp && (
                <p className="mt-1 text-xs text-brand-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
