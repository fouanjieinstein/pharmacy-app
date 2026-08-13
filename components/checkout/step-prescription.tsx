"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";
import { listPrescriptions } from "@/lib/services/prescription-service";
import { UploadDropzone } from "@/components/prescription/upload-dropzone";
import { PrescriptionStatusBadge } from "@/components/prescription/status-badge";
import type { PrescriptionUpload } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function StepPrescription({
  selectedId,
  onNext,
  onBack,
}: {
  selectedId: string | null;
  onNext: (prescriptionId: string) => void;
  onBack: () => void;
}) {
  const [uploads, setUploads] = useState<PrescriptionUpload[]>([]);
  const [selected, setSelected] = useState<string | null>(selectedId);

  useEffect(() => {
    listPrescriptions().then(setUploads).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="font-display mb-1 text-xl text-brand-navy-900">Prescription Verification</h2>
      <p className="mb-6 text-sm text-brand-gray-500">
        Your order contains prescription medicines. Select a previously uploaded prescription or upload a
        new one to continue.
      </p>

      {uploads.length > 0 && (
        <div className="mb-6 space-y-2.5">
          {uploads.map((upload) => (
            <label key={upload.id}>
              <Card
                className={cn(
                  "cursor-pointer transition-colors",
                  selected === upload.id && "border-brand-emerald-500 ring-1 ring-brand-emerald-500"
                )}
              >
                <CardBody className="flex items-center gap-3 py-3.5">
                  <input
                    type="radio"
                    name="prescription"
                    checked={selected === upload.id}
                    onChange={() => setSelected(upload.id)}
                    className="size-4 text-brand-emerald-600"
                  />
                  <FileText className="size-5 text-brand-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-navy-900">{upload.fileName}</p>
                    <p className="text-xs text-brand-gray-500">Uploaded {new Date(upload.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <PrescriptionStatusBadge status={upload.status} />
                </CardBody>
              </Card>
            </label>
          ))}
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-medium text-brand-navy-900">Or upload a new prescription</h3>
        <UploadDropzone
          onUploaded={(record) => {
            setUploads((prev) => [record, ...prev]);
            setSelected(record.id);
          }}
        />
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-sm bg-brand-gray-50 p-3.5 text-xs text-brand-gray-500">
        <ShieldCheck className="size-4 shrink-0 text-brand-emerald-600" />
        <span>
          Your prescription will be reviewed by a licensed pharmacist before your order is dispatched. You
          can also manage prescriptions anytime from{" "}
          <Link href="/account/prescriptions" className="underline">your account</Link>.
        </span>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" disabled={!selected} onClick={() => selected && onNext(selected)}>
          Continue to Shipping Method
        </Button>
      </div>
    </div>
  );
}
