import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "primary" | "danger";
  size: "sm" | "lg";
  handleClick?: () => void;
}

export default function Button({
  children,
  size = "sm",
  type = "primary",
  handleClick,
}: ButtonProps) {
  const baseStyles =
    "rounded-md text-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors cursor-pointer 3xl:text-xl";
  const typeStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
    danger:
      "bg-rose-100 text-red-500 hover:bg-rose-200 focus:ring-rose-500 border border-red-500",
  };
  const sizeStyles = {
    sm: "px-4 py-2 text-sm 3xl:text-xl 3xl:text-xl 3xl:px-5 3xl:py-3",
    lg: "w-full px-4 py-3 text-base font-semibold 3xl:text-2xl",
  };

  return (
    <button
      className={`${baseStyles} ${typeStyles[type]} ${sizeStyles[size]}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
