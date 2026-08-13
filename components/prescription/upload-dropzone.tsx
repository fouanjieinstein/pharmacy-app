"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_KB,
  uploadPrescription,
  validatePrescriptionFile,
} from "@/lib/services/prescription-service";
import type { PrescriptionUpload } from "@/types";
import { useToast } from "@/lib/context/toast-context";
import { cn } from "@/lib/utils/cn";

export function UploadDropzone({ onUploaded }: { onUploaded: (record: PrescriptionUpload) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = async (file: File) => {
    setError(null);
    const validation = validatePrescriptionFile(file);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid file.");
      return;
    }
    setUploading(true);
    try {
      const record = await uploadPrescription(file);
      onUploaded(record);
      showToast("Prescription uploaded successfully. It's now pending review.", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-14 text-center transition-colors",
          dragging ? "border-brand-emerald-500 bg-brand-emerald-50" : "border-brand-gray-300 bg-brand-gray-50"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="mb-3 size-9 animate-spin text-brand-emerald-600" />
            <p className="text-sm font-medium text-brand-navy-900">Uploading prescription…</p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 size-9 text-brand-gray-400" />
            <p className="text-sm font-medium text-brand-navy-900">
              Drag and drop your prescription here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-brand-emerald-700 underline"
              >
                browse files
              </button>
            </p>
            <p className="mt-2 text-xs text-brand-gray-500">
              Supported formats: PDF, JPG, PNG · Maximum size: {Math.round(MAX_FILE_SIZE_KB / 1024)} MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <FileText className="size-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
