import React from "react";

interface CheckboxFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> {
  id: string;
  label: string;
  colSpan?: string;
  error?: string;
}

export default function CheckboxField({
  id,
  label,
  colSpan = "col-span-2",
  error,
  checked,
  onChange,
  disabled,
}: CheckboxFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${colSpan}`}>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer select-none 3xl:text-xl"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="accent-indigo-600 h-4 w-4 rounded border-zinc-300 cursor-pointer disabled:cursor-not-allowed"
        />
        {label}
      </label>
      {error && (
        <span className="text-xs text-rose-500 3xl:text-lg">{error}</span>
      )}
    </div>
  );
}
