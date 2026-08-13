import { Search, FileCheck2, PackageCheck, Truck } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse & Select", description: "Explore OTC, prescription, and wellness products with clear ingredient and dosage information." },
  { icon: FileCheck2, title: "Verify Prescription", description: "Upload your prescription for medicines that require it — reviewed by a licensed pharmacist." },
  { icon: PackageCheck, title: "Secure Checkout", description: "Confirm destination-country eligibility, shipping method, and complete secure payment." },
  { icon: Truck, title: "Track Delivery", description: "Follow your order from pharmacy processing through customs to your door." },
];

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <div key={step.title} className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-navy-900 text-white">
              <step.icon className="size-5" />
            </span>
            <span className="font-display text-2xl text-brand-gray-200">0{i + 1}</span>
          </div>
          <h3 className="mb-1.5 text-base font-semibold text-brand-navy-900">{step.title}</h3>
          <p className="text-sm leading-relaxed text-brand-gray-500">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
