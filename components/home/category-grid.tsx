import Link from "next/link";
import {
  Thermometer,
  Wind,
  Flower2,
  Salad,
  Sparkles,
  Bandage,
  Pill,
  UserRound,
  Users,
  Baby,
  ShieldCheck,
  Stethoscope,
  Milk,
  Smile,
  Eye,
} from "lucide-react";
import type { ProductCategory } from "@/types";

const FEATURED: { id: ProductCategory; label: string; icon: typeof Thermometer }[] = [
  { id: "pain-fever", label: "Pain & Fever", icon: Thermometer },
  { id: "cold-flu", label: "Cold & Flu", icon: Wind },
  { id: "allergy", label: "Allergy Relief", icon: Flower2 },
  { id: "digestive-health", label: "Digestive Health", icon: Salad },
  { id: "skin-care", label: "Skin Care", icon: Sparkles },
  { id: "first-aid", label: "First Aid", icon: Bandage },
  { id: "vitamins-minerals", label: "Vitamins", icon: Pill },
  { id: "womens-health", label: "Women's Health", icon: UserRound },
  { id: "mens-health", label: "Men's Health", icon: Users },
  { id: "childrens-health", label: "Children's Health", icon: Baby },
  { id: "sexual-wellness", label: "Sexual Wellness", icon: ShieldCheck },
  { id: "medical-devices", label: "Medical Devices", icon: Stethoscope },
  { id: "baby-mother-care", label: "Baby & Mother Care", icon: Milk },
  { id: "oral-care", label: "Oral Care", icon: Smile },
  { id: "eye-ear-care", label: "Eye & Ear Care", icon: Eye },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {FEATURED.map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          href={`/categories/${id}`}
          className="group flex flex-col items-center gap-3 rounded-md border border-brand-gray-200 bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-emerald-300 hover:shadow-md"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600 transition-colors group-hover:bg-brand-emerald-600 group-hover:text-white">
            <Icon className="size-5.5" />
          </span>
          <span className="text-sm font-medium text-brand-navy-900">{label}</span>
        </Link>
      ))}
    </div>
  );
}
