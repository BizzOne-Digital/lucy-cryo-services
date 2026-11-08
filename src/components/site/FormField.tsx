import { cn } from "@/lib/utils";

/** Accessible label + control + error wrapper for public forms. */
export function FormField({
  id,
  label,
  error,
  required,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span className="text-teal" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
