import type { PrescriptionUpload, PrescriptionStatus } from "@/types";

export { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_KB, validatePrescriptionFile } from "@/lib/prescription-shared";

// Prescriptions are now uploaded to and served from real backend storage —
// see app/api/prescriptions/. Files live outside public/ on the server and
// every read is ownership/role-checked and audit-logged
// (lib/server/file-storage.ts, ARCHITECTURE.md §4).

async function throwApiError(res: Response): Promise<never> {
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error ?? "Something went wrong. Please try again.");
}

export async function uploadPrescription(file: File): Promise<PrescriptionUpload> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/prescriptions", { method: "POST", body: formData });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.prescription;
}

export async function listPrescriptions(): Promise<PrescriptionUpload[]> {
  const res = await fetch("/api/prescriptions", { cache: "no-store" });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.prescriptions;
}

export async function getPrescription(id: string): Promise<PrescriptionUpload | null> {
  const res = await fetch(`/api/prescriptions/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.prescription;
}

/** URL for viewing/downloading the underlying file — auth-gated, not a public path. */
export function prescriptionFileUrl(id: string): string {
  return `/api/prescriptions/${encodeURIComponent(id)}/file`;
}

export async function reviewPrescription(
  id: string,
  decision: Exclude<PrescriptionStatus, "pending_review">,
  notes?: string
): Promise<PrescriptionUpload> {
  const res = await fetch(`/api/prescriptions/${encodeURIComponent(id)}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision, notes }),
  });
  if (!res.ok) await throwApiError(res);
  const data = await res.json();
  return data.prescription;
}

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  pending_review: "Pending Review",
  under_pharmacist_review: "Under Pharmacist Review",
  approved: "Approved",
  rejected: "Rejected",
  info_required: "Additional Information Required",
};
