import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const GRADIENTS = [
  "from-brand-navy-700 to-brand-navy-900",
  "from-brand-emerald-600 to-brand-emerald-800",
  "from-brand-gold-600 to-brand-gold-700",
  "from-brand-navy-600 to-brand-emerald-700",
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// A deliberately abstract, illustrated avatar (silhouette + initials) rather
// than a photographic headshot — this app has no real photo of each doctor,
// and using a stock/AI-generated photo of a real or unreal person to
// represent a named physician on a site that takes real bookings would be
// misleading. Swap for real, consented staff photography in production.
export function DoctorAvatar({ name, seed, className }: { name: string; seed: string; className?: string }) {
  const gradient = GRADIENTS[hashSeed(seed) % GRADIENTS.length];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-display text-white",
        gradient,
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full opacity-20">
        <circle cx="50" cy="38" r="20" fill="white" />
        <path d="M10 100 a40 40 0 0 1 80 0 Z" fill="white" />
      </svg>
      <span className="relative">{initials(name)}</span>
      <span className="absolute bottom-0 right-0 flex size-[28%] items-center justify-center rounded-full bg-white text-brand-emerald-600 ring-2 ring-white">
        <Stethoscope className="size-[60%]" strokeWidth={2.25} />
      </span>
    </div>
  );
}
