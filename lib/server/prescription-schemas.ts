import { z } from "zod";
import type { PrescriptionStatus as DbPrescriptionStatus, Prisma } from "@/lib/generated/prisma";

export type PrescriptionWithLatestReview = Prisma.PrescriptionGetPayload<{
  include: { reviews: { include: { pharmacist: { select: { name: true } } } } };
}>;

const STATUS_TO_DB: Record<string, DbPrescriptionStatus> = {
  pending_review: "PENDING_REVIEW",
  under_pharmacist_review: "UNDER_PHARMACIST_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
  info_required: "INFO_REQUIRED",
};
const STATUS_FROM_DB = Object.fromEntries(
  Object.entries(STATUS_TO_DB).map(([front, db]) => [db, front])
) as Record<DbPrescriptionStatus, string>;

export function prescriptionStatusToDb(v: string): DbPrescriptionStatus {
  return STATUS_TO_DB[v];
}
export function prescriptionStatusFromDb(v: DbPrescriptionStatus): string {
  return STATUS_FROM_DB[v];
}

// Decisions a pharmacist can record — "pending_review" is only ever the
// automatic initial state, never something a reviewer sets.
export const reviewDecisionSchema = z.object({
  decision: z.enum(["under_pharmacist_review", "approved", "rejected", "info_required"]),
  notes: z.string().trim().max(2000).optional(),
});

export function serializePrescription(p: PrescriptionWithLatestReview) {
  const latestReview = [...p.reviews].sort((a, b) => b.reviewedAt.getTime() - a.reviewedAt.getTime())[0];

  return {
    id: p.id,
    fileName: p.fileName,
    fileType: p.fileType,
    fileSizeKb: p.fileSizeKb,
    uploadedAt: p.uploadedAt.toISOString(),
    status: prescriptionStatusFromDb(p.status),
    reviewedBy: latestReview?.pharmacist?.name,
    reviewNotes: latestReview?.notes ?? undefined,
  };
}
