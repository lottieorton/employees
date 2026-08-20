import React from "react";
import type { FieldWrapperProps } from "../FieldWrapper/FieldWrapper";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  options: SelectOption[];
}

export default function SelectField({
  id,
  label,
  colSpan = "col-span-1",
  required = false,
  error,
  options,
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${colSpan}`}>
      <label htmlFor={id} className="text-sm text-zinc-500">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        id={id}
        className="bg-white border border-zinc-200 p-2 rounded-md text-zinc-600 text-sm focus:outline-indigo-600 cursor-pointer"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
