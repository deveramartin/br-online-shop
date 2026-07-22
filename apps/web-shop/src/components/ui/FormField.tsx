import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({ label, error, htmlFor, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-[var(--muted)]">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
