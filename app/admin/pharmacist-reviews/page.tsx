import type { Metadata } from "next";
import { PharmacistReviewsClient } from "@/app/admin/pharmacist-reviews/reviews-client";

export const metadata: Metadata = { title: "Admin · Pharmacist Reviews", robots: { index: false, follow: false } };

export default function AdminPharmacistReviewsPage() {
  return <PharmacistReviewsClient />;
}
