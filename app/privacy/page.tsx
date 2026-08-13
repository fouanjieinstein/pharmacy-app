import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Meridian Health collects, uses, and protects your personal and health information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly, such as your name, contact details, shipping addresses, and prescription documents, as well as order and payment metadata (not raw card numbers). We do not sell your personal or health information.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to process orders, verify prescriptions with our pharmacist team, arrange shipping, communicate order updates, and comply with applicable pharmaceutical and consumer-protection regulations.",
  },
  {
    title: "3. Prescription & Health Data",
    body: "Prescription documents and related health information are treated as sensitive data, access-restricted to authorized pharmacist and support staff, and retained only as long as necessary for dispensing, compliance, and support purposes.",
  },
  {
    title: "4. Payment Data",
    body: "Payments are processed by PCI-compliant third-party payment providers. We store only non-sensitive transaction metadata (provider, transaction ID, status, amount, currency, last 4 digits, card brand) — never full card numbers, CVV/CVC, or PINs.",
  },
  {
    title: "5. Sharing With Third Parties",
    body: "We share data only as necessary with payment providers, logistics/shipping partners, and — where legally required — regulatory authorities. We do not share your data for third-party marketing without consent.",
  },
  {
    title: "6. International Transfers",
    body: "Because we ship internationally, your order and shipping information may be transferred to logistics partners and, where applicable, customs authorities in the destination country.",
  },
  {
    title: "7. Your Rights",
    body: "Depending on your jurisdiction, you may have rights to access, correct, or request deletion of your personal data, subject to record-keeping obligations for dispensed medicines. Contact our support team to exercise these rights.",
  },
  {
    title: "8. Security",
    body: "We apply security practices including encrypted connections (HTTPS), access-controlled prescription storage, and payment tokenization. No system is completely immune to risk, and we continuously work to improve our safeguards.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Legal</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Privacy Policy</h1>

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
