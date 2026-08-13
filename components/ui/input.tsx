import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
}

const fieldBase =
  "w-full rounded-sm border border-brand-gray-300 bg-white px-3.5 h-11 text-sm text-brand-navy-900 placeholder:text-brand-gray-500 transition-colors focus:border-brand-navy-900 focus:outline-none";

export const Label = ({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-brand-navy-900">
    {children}
    {required && <span className="ml-0.5 text-red-600">*</span>}
  </label>
);

export const FieldError = ({ error }: { error?: string }) =>
  error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null;

export const FieldHint = ({ hint }: { hint?: string }) =>
  hint ? <p className="mt-1.5 text-xs text-brand-gray-500">{hint}</p> : null;

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, required, id, ...props }, ref) => (
    <div>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(fieldBase, error && "border-red-500 focus:border-red-500", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      <FieldError error={error} />
      <FieldHint hint={hint} />
    </div>
  )
);
Input.displayName = "Input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldWrapperProps;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, required, id, children, ...props }, ref) => (
    <div>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(fieldBase, "appearance-none bg-white", error && "border-red-500", className)}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      <FieldError error={error} />
      <FieldHint hint={hint} />
    </div>
  )
);
Select.displayName = "Select";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, required, id, ...props }, ref) => (
    <div>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-sm border border-brand-gray-300 bg-white px-3.5 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-gray-500 focus:border-brand-navy-900 focus:outline-none",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      <FieldError error={error} />
      <FieldHint hint={hint} />
    </div>
  )
);
Textarea.displayName = "Textarea";
