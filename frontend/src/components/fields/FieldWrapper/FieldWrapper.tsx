export interface FieldWrapperProps {
  id?: string;
  label: string;
  colSpan?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  id,
  label,
  colSpan = "col-span-2",
  required,
  error,
  children,
}: FieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-1 ${colSpan}`}>
      <label htmlFor={id} className="text-sm text-zinc-500">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
