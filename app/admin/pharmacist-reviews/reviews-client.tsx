"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, FileText } from "lucide-react";
import { adminPrescriptionReviews, type AdminPrescriptionReview } from "@/lib/data/admin-mock";
import { PrescriptionStatusBadge } from "@/components/prescription/status-badge";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/context/toast-context";

export function PharmacistReviewsClient() {
  const [reviews, setReviews] = useState<AdminPrescriptionReview[]>(adminPrescriptionReviews);
  const { showToast } = useToast();

  const updateStatus = (id: string, status: AdminPrescriptionReview["status"]) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status, assignedPharmacist: r.assignedPharmacist ?? "Pharm. R. Nair, RPh" } : r)));
    showToast("Review status updated.", "success");
  };

  const queue = reviews.filter((r) => r.status === "pending_review" || r.status === "under_pharmacist_review");
  const resolved = reviews.filter((r) => r.status !== "pending_review" && r.status !== "under_pharmacist_review");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display mb-4 text-xl text-brand-navy-900">Review Queue ({queue.length})</h2>
        <div className="space-y-3">
          {queue.map((review) => (
            <Card key={review.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-sm bg-brand-gray-100 text-brand-gray-500">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-navy-900">{review.patientName} — {review.medication}</p>
                    <p className="text-xs text-brand-gray-500">{review.fileName} · Submitted {new Date(review.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PrescriptionStatusBadge status={review.status} />
                  <Button size="sm" variant="secondary" onClick={() => updateStatus(review.id, "approved")}>
                    <CheckCircle2 className="size-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(review.id, "info_required")}>
                    <HelpCircle className="size-3.5" /> Request Info
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => updateStatus(review.id, "rejected")}>
                    <XCircle className="size-3.5" /> Reject
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
          {queue.length === 0 && <p className="text-sm text-brand-gray-500">No pending reviews. Queue is clear.</p>}
        </div>
      </div>

      <div>
        <h2 className="font-display mb-4 text-xl text-brand-navy-900">Recently Resolved</h2>
        <div className="space-y-3">
          {resolved.map((review) => (
            <Card key={review.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-brand-navy-900">{review.patientName} — {review.medication}</p>
                  <p className="text-xs text-brand-gray-500">Reviewed by {review.assignedPharmacist}</p>
                </div>
                <PrescriptionStatusBadge status={review.status} />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
