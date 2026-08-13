import type { Metadata } from "next";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ordering, prescriptions, shipping, and payments.",
};

const faqGroups = [
  {
    title: "Ordering & Products",
    items: [
      { q: "How do I know if a product requires a prescription?", a: "Every product page and product card clearly displays a \"Prescription Required\" or \"Over-the-Counter\" badge." },
      { q: "Are the medical descriptions on this site medical advice?", a: "No. Product information is general and educational. Always consult a qualified healthcare professional for advice specific to your situation." },
      { q: "Can I change the currency I see prices in?", a: "Yes — use the currency selector in the header to switch between USD, EUR, GBP, CAD, INR, AED, and XAF." },
    ],
  },
  {
    title: "Prescriptions",
    items: [
      { q: "How does prescription verification work?", a: "Upload a clear photo or scan of your valid prescription. A licensed pharmacist reviews it before your prescription order is processed." },
      { q: "What file types can I upload?", a: "PDF, JPG, JPEG, and PNG files up to 10 MB." },
      { q: "How long does review take?", a: "Typically within a few hours during business days, though this can vary. You can check status anytime from your account." },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      { q: "Do you ship to every country?", a: "No. Shipping eligibility, especially for prescription medicines, depends on destination-country import and pharmaceutical regulations. Eligibility is checked at checkout based on your selected country." },
      { q: "What shipping methods are available?", a: "Standard International, Express International, and — where destination infrastructure supports it — Cold-Chain Delivery for temperature-sensitive medicines." },
      { q: "Will I pay customs duties?", a: "Possibly. Import duties and taxes are set by the destination country and are the responsibility of the customer unless stated otherwise." },
    ],
  },
  {
    title: "Payments",
    items: [
      { q: "Is my card information stored?", a: "No. Payments are processed via tokenization, and raw card numbers or CVV are never stored on our servers." },
      { q: "What payment methods are supported?", a: "Credit/debit cards, with mobile payment options coming soon." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Support</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Frequently Asked Questions</h1>

      <div className="mt-10 space-y-10">
        {faqGroups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-2 text-base font-semibold text-brand-navy-900">{group.title}</h2>
            <Accordion>
              {group.items.map((item) => (
                <AccordionItem key={item.q} question={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
