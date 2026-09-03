import React from "react";
import {
  FieldWrapper,
  type FieldWrapperProps,
} from "../FieldWrapper/FieldWrapper";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { FormOption } from "../../../interfaces/formInterfaces";

interface SelectFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  options: FormOption[];
  registration?: UseFormRegisterReturn;
}

export default function SelectField({
  id,
  label,
  colSpan,
  required,
  error,
  options,
  registration,
}: SelectFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      colSpan={colSpan}
      required={required}
      error={error}
    >
      <select
        id={id}
        {...registration}
        className="bg-white border border-zinc-200 p-2 rounded-md text-zinc-600 text-sm focus:outline-indigo-600 cursor-pointer 3xl:text-xl"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
