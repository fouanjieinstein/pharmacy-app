import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Important information about the educational nature of content on Meridian Health.",
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Legal</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Medical Disclaimer</h1>

      <div className="mt-8 flex gap-3 rounded-md border border-brand-gold-200 bg-brand-gold-50 p-5">
        <AlertTriangle className="size-5 shrink-0 text-brand-gold-700" />
        <p className="text-sm font-medium leading-relaxed text-brand-gold-700">
          Information provided on this website is for general educational purposes and does not replace
          advice from a qualified healthcare professional.
        </p>
      </div>

      <div className="mt-10 space-y-7 text-sm leading-relaxed text-brand-gray-600">
        <section>
          <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Not a Substitute for Professional Medical Advice</h2>
          <p>
            Meridian Health does not diagnose medical conditions and does not prescribe medication. Product
            descriptions, indications, and educational content on this platform are general in nature and are
            not a substitute for the individualized advice of a licensed physician, pharmacist, or other
            qualified healthcare provider. Always seek the advice of a qualified healthcare professional with
            any questions you may have regarding a medical condition or treatment.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">No Guarantee of Outcomes</h2>
          <p>
            No product listed on this platform is marketed or guaranteed to cure, prevent, or treat cancer or
            any other serious disease. Where oncology or other specialist medications are listed, they are
            presented as components of a broader, physician-directed treatment plan — not as standalone cures.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Prescription Products</h2>
          <p>
            Prescription medications are dispensed only against a valid prescription issued by a qualified
            prescriber and verified by a licensed pharmacist. Approval of a prescription order does not
            constitute a medical recommendation by Meridian Health — it confirms that dispensing requirements
            have been met.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Emergency Situations</h2>
          <p>
            This platform is not intended for use in medical emergencies. If you are experiencing a medical
            emergency, contact your local emergency services immediately.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">Country-Specific Availability</h2>
          <p>
            Product availability, indications, and regulatory status can vary by country. Information on this
            platform reflects general/standard indications and may not reflect the specific regulatory status
            of a product in your country of residence.
          </p>
        </section>
      </div>
    </div>
  );
}
