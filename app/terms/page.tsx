import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of the Meridian Health platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using this platform, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use this platform.",
  },
  {
    title: "2. Eligibility & Account Responsibility",
    body: "You must provide accurate information when creating an account and placing orders. You are responsible for maintaining the confidentiality of your account credentials.",
  },
  {
    title: "3. Prescription Medicines",
    body: "Prescription products are dispensed only against a valid prescription verified by a licensed pharmacist. We reserve the right to reject, delay, or request additional information for any prescription order at our discretion.",
  },
  {
    title: "4. Not Medical Advice",
    body: "Content on this platform is for general educational purposes only and does not constitute medical advice. It does not replace consultation with a qualified healthcare professional.",
  },
  {
    title: "5. Shipping Eligibility",
    body: "Product availability and shipping eligibility vary by destination country and are subject to local import, customs, and pharmaceutical regulations. We do not guarantee that any product can be shipped to any location.",
  },
  {
    title: "6. Payments",
    body: "Payments are processed through third-party, PCI-compliant payment providers. By submitting payment information, you authorize the applicable charge for your order.",
  },
  {
    title: "7. Limitation of Liability",
    body: "To the maximum extent permitted by law, Meridian Health is not liable for indirect, incidental, or consequential damages arising from use of this platform, except as required by applicable law.",
  },
  {
    title: "8. Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised Terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Legal</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Terms of Service</h1>

      <div className="mt-10 space-y-7 text-sm leading-relaxed text-brand-gray-600">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-1.5 text-base font-semibold text-brand-navy-900">{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
