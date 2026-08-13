import type { Product } from "@/types";
import { Tabs } from "@/components/ui/tabs";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { AlertTriangle, Ban, ThermometerSnowflake } from "lucide-react";

export function ProductTabs({ product }: { product: Product }) {
  return (
    <Tabs
      items={[
        {
          id: "description",
          label: "Description",
          content: (
            <div className="space-y-5 text-sm leading-relaxed text-brand-gray-600">
              <p>{product.description}</p>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-brand-navy-900">Approved / Standard Indications</h4>
                <ul className="list-inside list-disc space-y-1">
                  {product.approvedIndications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-brand-navy-900">Directions for Use</h4>
                <ul className="list-inside list-disc space-y-1">
                  {product.directions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2.5 rounded-sm bg-brand-gray-50 p-3.5 text-xs text-brand-gray-500">
                <ThermometerSnowflake className="size-4 shrink-0" />
                <span>{product.storageInstructions}</span>
              </div>
            </div>
          ),
        },
        {
          id: "warnings",
          label: "Warnings & Safety",
          content: (
            <div className="space-y-6 text-sm leading-relaxed text-brand-gray-600">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-navy-900">
                  <AlertTriangle className="size-4 text-brand-gold-600" /> Warnings
                </h4>
                <ul className="list-inside list-disc space-y-1">
                  {product.warnings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-navy-900">
                  <Ban className="size-4 text-red-600" /> Contraindications
                </h4>
                {product.contraindications.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1">
                    {product.contraindications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-brand-gray-500">No specific contraindications listed.</p>
                )}
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-brand-navy-900">Possible Side Effects</h4>
                {product.sideEffects.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1">
                    {product.sideEffects.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-brand-gray-500">No specific side effects listed.</p>
                )}
              </div>
            </div>
          ),
        },
        {
          id: "faq",
          label: "FAQs",
          content:
            product.faqs.length > 0 ? (
              <Accordion>
                {product.faqs.map((faq) => (
                  <AccordionItem key={faq.question} question={faq.question}>
                    {faq.answer}
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-brand-gray-500">No frequently asked questions for this product yet.</p>
            ),
        },
      ]}
    />
  );
}
