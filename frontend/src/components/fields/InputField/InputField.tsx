import React from "react";
import {
  FieldWrapper,
  type FieldWrapperProps,
} from "../FieldWrapper/FieldWrapper";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "password";
  registration?: UseFormRegisterReturn;
}

export default function InputField({
  id,
  label,
  type = "text",
  colSpan,
  required,
  error,
  disabled,
  registration,
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      colSpan={colSpan}
      required={required}
      error={error}
    >
      <input
        id={id}
        type={type}
        disabled={disabled}
        {...registration}
        className="bg-white border border-zinc-200 p-2 rounded-md text-zinc-600 text-sm focus:outline-indigo-600 disabled:bg-zinc-100 disabled:cursor-not-allowed 3xl:text-xl"
      />
    </FieldWrapper>
  );
}
