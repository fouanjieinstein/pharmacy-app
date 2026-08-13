import type { Metadata } from "next";
import { PackageX, RotateCcw, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Our returns and refund policy for medicines and wellness products.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Support</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Returns & Refunds</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-brand-gray-600">
        <section className="flex gap-4">
          <ShieldAlert className="size-5 shrink-0 text-brand-gold-600" />
          <div>
            <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Medicines Cannot Generally Be Returned</h2>
            <p>
              For safety and regulatory reasons, opened or dispensed medicines — both over-the-counter and
              prescription — generally cannot be returned once shipped, in line with standard pharmaceutical
              industry practice. This protects the integrity of the medicine supply chain.
            </p>
          </div>
        </section>

        <section className="flex gap-4">
          <PackageX className="size-5 shrink-0 text-brand-navy-700" />
          <div>
            <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Damaged, Incorrect, or Undelivered Orders</h2>
            <p>
              If your order arrives damaged, incorrect, or does not arrive, contact our support team within
              7 days of the expected delivery date. We will review the case and, where appropriate, arrange
              a replacement or refund.
            </p>
          </div>
        </section>

        <section className="flex gap-4">
          <RotateCcw className="size-5 shrink-0 text-brand-emerald-600" />
          <div>
            <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Refund Processing</h2>
            <p>
              Approved refunds are issued to your original payment method via our payment provider. Processing
              typically takes 5–10 business days depending on your card issuer or payment provider, after
              which you can check refund status from your account order history.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Orders Cancelled Before Dispatch</h2>
          <p>
            Orders that are cancelled before dispatch — including prescription orders rejected during
            pharmacist review — are eligible for a full refund to the original payment method.
          </p>
        </section>
      </div>
    </div>
  );
}
