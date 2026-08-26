import React from "react";
import {
  FieldWrapper,
  type FieldWrapperProps,
} from "../FieldWrapper/FieldWrapper";
import type { UseFormRegisterReturn } from "react-hook-form";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupFieldProps extends Omit<FieldWrapperProps, "children"> {
  id: string;
  name: string;
  options: RadioOption[];
  direction?: "row" | "col";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  registration?: UseFormRegisterReturn;
}

export default function RadioGroupField({
  id,
  name = id,
  label,
  options,
  direction = "row",
  colSpan,
  required,
  error,
  onChange,
  registration,
}: RadioGroupFieldProps) {
  const layoutClass =
    direction === "col"
      ? "flex flex-col gap-2 pt-1"
      : "flex flex-row flex-wrap gap-4 items-center pt-1";

  return (
    <FieldWrapper
      id={id}
      label={label}
      colSpan={colSpan}
      required={required}
      error={error}
    >
      <div className={layoutClass}>
        {options.map((opt) => (
          <label
            key={opt.value}
            htmlFor={`${id}-${opt.value}`}
            className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer 3xl:text-xl"
          >
            <input
              type="radio"
              id={`${id}-${opt.value}`}
              name={name}
              value={opt.value}
              onChange={onChange}
              {...registration}
              className="accent-indigo-600 h-4 w-4 cursor-pointer"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}
