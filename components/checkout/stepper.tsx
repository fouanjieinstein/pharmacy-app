import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StepDef {
  id: number;
  label: string;
}

export function Stepper({ steps, currentStep }: { steps: StepDef[]; currentStep: number }) {
  return (
    <ol className="scrollbar-thin flex items-center gap-1 overflow-x-auto pb-2" aria-label="Checkout progress">
      {steps.map((step, i) => {
        const state = step.id < currentStep ? "done" : step.id === currentStep ? "active" : "upcoming";
        return (
          <li key={step.id} className="flex shrink-0 items-center">
            <div className="flex items-center gap-2">
              <span
                aria-current={state === "active" ? "step" : undefined}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  state === "done" && "bg-brand-emerald-600 text-white",
                  state === "active" && "bg-brand-navy-900 text-white",
                  state === "upcoming" && "bg-brand-gray-200 text-brand-gray-500"
                )}
              >
                {state === "done" ? <Check className="size-3.5" /> : step.id}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-xs font-medium",
                  state === "upcoming" ? "text-brand-gray-400" : "text-brand-navy-900"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && <span className="mx-2.5 h-px w-6 shrink-0 bg-brand-gray-200" />}
          </li>
        );
      })}
    </ol>
  );
}
