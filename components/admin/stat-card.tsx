import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  changePct,
  icon: Icon,
}: {
  label: string;
  value: string;
  changePct?: number;
  icon: LucideIcon;
}) {
  const positive = (changePct ?? 0) >= 0;

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-brand-gray-500">{label}</p>
            <p className="font-display mt-1.5 text-2xl text-brand-navy-900">{value}</p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
            <Icon className="size-4.5" />
          </span>
        </div>
        {changePct !== undefined && (
          <p className={cn("mt-3 flex items-center gap-1 text-xs font-medium", positive ? "text-brand-emerald-600" : "text-red-600")}>
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(changePct)}% vs last month
          </p>
        )}
      </CardBody>
    </Card>
  );
}
