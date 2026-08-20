import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "primary" | "danger";
  size: "sm" | "lg";
}

export default function Button({
  children,
  size = "sm",
  type = "primary",
}: ButtonProps) {
  const baseStyles =
    "px-3.5 py-1.5 rounded-md text-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors cursor-pointer";
  const typeStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
    danger:
      "bg-rose-100 text-red-500 hover:bg-rose-200 focus:ring-rose-500 border border-red-500",
  };
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    lg: "w-full px-4 py-3 text-base font-semibold",
  };

  return (
    <button className={`${baseStyles} ${typeStyles[type]} ${sizeStyles[size]}`}>
      {children}
    </button>
  );
}
