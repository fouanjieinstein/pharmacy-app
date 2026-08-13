import { Clock, Eye, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import type { PrescriptionStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PRESCRIPTION_STATUS_LABELS } from "@/lib/services/prescription-service";

const CONFIG: Record<PrescriptionStatus, { variant: "gray" | "gold" | "emerald" | "red"; icon: typeof Clock }> = {
  pending_review: { variant: "gray", icon: Clock },
  under_pharmacist_review: { variant: "gold", icon: Eye },
  approved: { variant: "emerald", icon: CheckCircle2 },
  rejected: { variant: "red", icon: XCircle },
  info_required: { variant: "gold", icon: HelpCircle },
};

export function PrescriptionStatusBadge({ status }: { status: PrescriptionStatus }) {
  const { variant, icon: Icon } = CONFIG[status];
  return (
    <Badge variant={variant} icon={<Icon className="size-3" />}>
      {PRESCRIPTION_STATUS_LABELS[status]}
    </Badge>
  );
}
