import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { company } from "@/lib/data/company";

export const metadata: Metadata = { title: "Admin · Settings", robots: { index: false, follow: false } };

const ENV_VARS = [
  { key: "PAYMENT_PROVIDER", desc: "Active payment provider identifier (e.g. stripe, flutterwave, dpo-pay)." },
  { key: "MERCHANT_ACCOUNT", desc: "Merchant/business account reference used for settlement routing." },
  { key: "SETTLEMENT_CURRENCY", desc: "Currency in which successful payments are settled to the business bank account." },
  { key: "WEBHOOK_ENDPOINT", desc: "Backend URL that receives and verifies payment-provider webhook events." },
  { key: "EMAIL_USER", desc: "Gmail address transactional order-confirmation emails are sent from." },
  { key: "EMAIL_APP_PASSWORD", desc: "Gmail App Password for EMAIL_USER — never the account's regular login password." },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardBody>
          <div className="mb-4 flex items-center gap-2">
            <Lock className="size-4.5 text-brand-gray-400" />
            <h2 className="font-display text-lg text-brand-navy-900">Backend Environment Configuration</h2>
          </div>
          <p className="mb-5 text-xs text-brand-gray-500">
            These values are set as server-side environment variables and are never exposed to or editable
            from the frontend. Shown here as a reference only.
          </p>
          <div className="divide-y divide-brand-gray-100">
            {ENV_VARS.map((v) => (
              <div key={v.key} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <code className="text-sm font-medium text-brand-navy-900">{v.key}</code>
                <p className="text-xs text-brand-gray-500 sm:max-w-md sm:text-right">{v.desc}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-display mb-4 text-lg text-brand-navy-900">Platform Settings</h2>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-brand-gray-500">Store Name</p>
              <p className="mt-0.5 font-medium text-brand-navy-900">{company.legalName}</p>
            </div>
            <div>
              <p className="text-xs text-brand-gray-500">Headquarters</p>
              <p className="mt-0.5 font-medium text-brand-navy-900">{company.addressLines.join(", ")}</p>
            </div>
            <div>
              <p className="text-xs text-brand-gray-500">Support Email</p>
              <p className="mt-0.5 font-medium text-brand-navy-900">{company.supportEmail}</p>
            </div>
            <div>
              <p className="text-xs text-brand-gray-500">Default Currency</p>
              <p className="mt-0.5 font-medium text-brand-navy-900">USD</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
