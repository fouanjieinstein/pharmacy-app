"use client";

import { useEffect, useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { UploadDropzone } from "@/components/prescription/upload-dropzone";
import { PrescriptionStatusBadge } from "@/components/prescription/status-badge";
import { listPrescriptions } from "@/lib/services/prescription-service";
import type { PrescriptionUpload } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardBody } from "@/components/ui/card";
import { CardListSkeleton } from "@/components/ui/skeleton";

const STATUS_STEPS = [
  { status: "pending_review", label: "Pending Review", description: "We've received your file and it's queued for review." },
  { status: "under_pharmacist_review", label: "Under Pharmacist Review", description: "A licensed pharmacist is verifying the prescription details." },
  { status: "approved", label: "Approved", description: "Your prescription is approved and linked to eligible orders." },
] as const;

export function PrescriptionClient() {
  const [uploads, setUploads] = useState<PrescriptionUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only the first fetch shows a loading state — the 5s poll after that
    // should update silently, not flicker the list back to a skeleton.
    let first = true;
    const refresh = () =>
      listPrescriptions()
        .then(setUploads)
        .catch(() => {})
        .finally(() => {
          if (first) {
            setLoading(false);
            first = false;
          }
        });
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
      <div>
        <UploadDropzone onUploaded={(record) => setUploads((prev) => [record, ...prev])} />

        <div className="mt-10">
          <h2 className="font-display mb-4 text-xl text-brand-navy-900">Your Uploaded Prescriptions</h2>
          {loading ? (
            <CardListSkeleton count={2} />
          ) : uploads.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-10" />}
              title="No prescriptions uploaded yet"
              description="Upload a prescription above to get started. You can link it to a prescription order at checkout."
            />
          ) : (
            <ul className="animate-fade-in space-y-3">
              {uploads.map((upload) => (
                <li key={upload.id}>
                  <Card>
                    <CardBody className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-sm bg-brand-gray-100 text-brand-gray-500">
                          <FileText className="size-5" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-brand-navy-900">{upload.fileName}</p>
                          <p className="text-xs text-brand-gray-500">
                            Uploaded {new Date(upload.uploadedAt).toLocaleString()} · {upload.fileSizeKb} KB
                          </p>
                          {upload.reviewedBy && (
                            <p className="text-xs text-brand-gray-500">Reviewed by {upload.reviewedBy}</p>
                          )}
                        </div>
                      </div>
                      <PrescriptionStatusBadge status={upload.status} />
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardBody>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-brand-navy-900">
              <ShieldCheck className="size-5 text-brand-emerald-600" /> How Review Works
            </h3>
            <ol className="space-y-4">
              {STATUS_STEPS.map((step, i) => (
                <li key={step.status} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-navy-900 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-navy-900">{step.label}</p>
                    <p className="mt-0.5 text-xs text-brand-gray-500">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="mb-3 text-sm font-semibold text-brand-navy-900">Good to Know</h3>
            <ul className="list-inside list-disc space-y-2 text-xs leading-relaxed text-brand-gray-500">
              <li>Accepted formats: PDF, JPG, JPEG, PNG (max 10 MB)</li>
              <li>Ensure the prescription is legible and includes prescriber details</li>
              <li>Prescriptions are reviewed by a licensed pharmacist before any order ships</li>
              <li>Country-specific import restrictions may still apply even after approval</li>
              <li>We may request additional information if anything is unclear</li>
            </ul>
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}
