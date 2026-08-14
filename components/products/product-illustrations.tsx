// Hand-built vector illustrations representing each product's form factor.
// Deliberately illustrative rather than photographic: this avoids relying on
// third-party stock photography of unknown licensing, and — for a catalog
// that includes prescription medicines — keeps imagery clearly editorial
// rather than implying real packaging/branding that doesn't exist. Swap for
// real product photography from the pharmacy-management system's media
// pipeline in production.

import type { ReactElement, SVGProps } from "react";

type IllustrationProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 100 100",
  fill: "none",
} as const;

export function BlisterPackIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="14" y="22" width="72" height="9" rx="4" fill="currentColor" opacity="0.22" />
      <rect x="16" y="30" width="68" height="42" rx="8" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <g key={`${col}-${row}`}>
            <circle cx={28 + col * 15} cy={42 + row * 18} r="6" fill="white" stroke="currentColor" strokeWidth="1.75" />
            <path d={`M${25 + col * 15} ${39 + row * 18} q3 -3 6 0`} stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
          </g>
        ))
      )}
    </svg>
  );
}

export function CapsuleIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <g transform="rotate(-30 50 50)">
        <rect x="24" y="41" width="52" height="18" rx="9" fill="currentColor" opacity="0.85" />
        <rect x="50" y="41" width="26" height="18" rx="9" fill="white" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="41" x2="50" y2="59" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </g>
      <g transform="rotate(20 22 78) translate(-2 6)" opacity="0.55">
        <rect x="10" y="70" width="26" height="10" rx="5" fill="currentColor" opacity="0.7" />
        <rect x="23" y="70" width="13" height="10" rx="5" fill="white" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function SyrupBottleIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="38" y="16" width="14" height="10" rx="2" fill="currentColor" opacity="0.7" />
      <rect x="41" y="24" width="8" height="10" fill="currentColor" opacity="0.3" />
      <rect x="30" y="32" width="26" height="46" rx="7" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="2" />
      <path d="M31 55 q6 -4 12 0 t12 0 v22 a2 2 0 0 1 -2 2 H33 a2 2 0 0 1 -2 -2 Z" fill="currentColor" opacity="0.3" />
      <rect x="31" y="47" width="24" height="6" fill="currentColor" opacity="0.15" />
      <g transform="translate(64 58)" opacity="0.85">
        <path d="M0 14 L4 0 H14 L18 14 a2 2 0 0 1 -2 2 H2 a2 2 0 0 1 -2 -2 Z" fill="white" stroke="currentColor" strokeWidth="1.75" />
        <line x1="3" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
      </g>
    </svg>
  );
}

export function CreamTubeIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="43" y="16" width="14" height="9" rx="2" fill="currentColor" opacity="0.75" />
      <path d="M40 25 h20 l-4 12 h-12 Z" fill="currentColor" opacity="0.5" />
      <rect x="32" y="37" width="36" height="42" rx="14" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="32" y="53" width="36" height="12" fill="currentColor" opacity="0.15" />
      <line x1="38" y1="53" x2="38" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="62" y1="53" x2="62" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function InhalerIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="38" y="14" width="18" height="30" rx="6" fill="currentColor" opacity="0.65" />
      <rect x="42" y="14" width="4" height="24" fill="white" opacity="0.4" />
      <path
        d="M30 40 h34 a6 6 0 0 1 6 6 v18 a8 8 0 0 1 -8 8 h-6 l-6 14 h-6 l-6 -14 h-8 a6 6 0 0 1 -6 -6 v-20 a6 6 0 0 1 6 -6 Z"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function DropperBottleIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="50" cy="15" rx="7" ry="6" fill="currentColor" opacity="0.7" />
      <rect x="45" y="19" width="10" height="20" fill="currentColor" opacity="0.35" />
      <rect x="42" y="36" width="16" height="8" rx="2" fill="currentColor" opacity="0.6" />
      <path d="M34 44 h32 l-3 8 a8 8 0 0 1 -1 2 v18 a10 10 0 0 1 -10 10 h-4 a10 10 0 0 1 -10 -10 V54 a8 8 0 0 1 -1 -2 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="62" x2="60" y2="62" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
    </svg>
  );
}

export function FirstAidKitIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <path d="M40 28 a10 10 0 0 1 20 0 v6 h-20 Z" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
      <rect x="20" y="34" width="60" height="40" rx="8" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="34" width="60" height="10" opacity="0.15" fill="currentColor" />
      <rect x="44" y="46" width="12" height="20" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="38" y="52" width="24" height="8" rx="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function SupplementJarIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="30" y="24" width="40" height="14" rx="5" fill="currentColor" opacity="0.7" />
      <rect x="34" y="38" width="32" height="40" rx="10" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="34" y="52" width="32" height="14" opacity="0.15" fill="currentColor" />
      <path d="M69 30 q10 -6 14 4 q-10 6 -14 -4 Z" fill="currentColor" opacity="0.55" />
      <line x1="70" y1="31" x2="78" y2="27" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
    </svg>
  );
}

export function InjectionPenIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <g transform="rotate(-35 50 50)">
        <rect x="16" y="43" width="14" height="14" rx="3" fill="currentColor" opacity="0.6" />
        <rect x="30" y="41" width="40" height="18" rx="4" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
        <line x1="42" y1="41" x2="42" y2="59" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
        <line x1="52" y1="41" x2="52" y2="59" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
        <line x1="62" y1="41" x2="62" y2="59" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
        <rect x="70" y="46" width="10" height="8" fill="currentColor" opacity="0.5" />
        <line x1="80" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function BrandedBoxIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="22" y="18" width="56" height="64" rx="4" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="22" y="18" width="56" height="16" fill="currentColor" opacity="0.85" />
      <rect x="30" y="24" width="24" height="4" rx="2" fill="white" opacity="0.9" />
      <circle cx="50" cy="56" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <path d="M43 56 l5 5 l9 -10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="30" y="72" width="40" height="4" rx="2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function MedicalDeviceIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="30" y="16" width="40" height="58" rx="10" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="36" y="24" width="28" height="18" rx="3" fill="currentColor" opacity="0.85" />
      <rect x="40" y="28" width="12" height="3" rx="1.5" fill="white" opacity="0.9" />
      <rect x="40" y="34" width="8" height="3" rx="1.5" fill="white" opacity="0.6" />
      <circle cx="50" cy="58" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="50" cy="58" r="2.5" fill="currentColor" opacity="0.6" />
      <line x1="34" y1="66" x2="66" y2="66" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
    </svg>
  );
}

export function SprayBottleIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="40" y="14" width="10" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
      <path d="M50 16 h10 a3 3 0 0 1 3 3 v3 a3 3 0 0 1 -3 3 h-10 Z" fill="currentColor" opacity="0.5" />
      <line x1="63" y1="19.5" x2="72" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <rect x="34" y="30" width="24" height="48" rx="7" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="34" y="44" width="24" height="6" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

export function BabyBottleIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="50" cy="24" rx="9" ry="5" fill="currentColor" opacity="0.7" />
      <rect x="44" y="27" width="12" height="8" fill="currentColor" opacity="0.35" />
      <path d="M32 35 h36 l-3 40 a8 8 0 0 1 -8 7 H43 a8 8 0 0 1 -8 -7 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="34" y="50" width="32" height="10" opacity="0.18" fill="currentColor" />
      <line x1="38" y1="42" x2="62" y2="42" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
    </svg>
  );
}

export function PadPackIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="18" y="26" width="64" height="46" rx="6" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="26" width="64" height="13" fill="currentColor" opacity="0.85" />
      <rect x="26" y="30.5" width="20" height="4" rx="2" fill="white" opacity="0.9" />
      <rect x="30" y="48" width="18" height="14" rx="7" fill="currentColor" opacity="0.3" />
      <rect x="52" y="48" width="18" height="14" rx="7" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function TestStripIllustration(props: IllustrationProps) {
  return (
    <svg {...base} {...props}>
      <rect x="24" y="18" width="52" height="30" rx="5" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="18" width="52" height="9" fill="currentColor" opacity="0.85" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`rotate(-18 ${34 + i * 15} 64)`}>
          <rect x={30 + i * 15} y="52" width="8" height="26" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <rect x={30 + i * 15} y="70" width="8" height="8" rx="1" fill="currentColor" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

export const PRODUCT_ILLUSTRATIONS: Record<string, (props: IllustrationProps) => ReactElement> = {
  tablet: BlisterPackIllustration,
  capsule: CapsuleIllustration,
  syrup: SyrupBottleIllustration,
  cream: CreamTubeIllustration,
  inhaler: InhalerIllustration,
  drops: DropperBottleIllustration,
  kit: FirstAidKitIllustration,
  supplement: SupplementJarIllustration,
  injection: InjectionPenIllustration,
  box: BrandedBoxIllustration,
  device: MedicalDeviceIllustration,
  spray: SprayBottleIllustration,
  bottle: BabyBottleIllustration,
  pad: PadPackIllustration,
  strip: TestStripIllustration,
};
