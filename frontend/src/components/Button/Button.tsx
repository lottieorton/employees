import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "primary" | "danger" | "secondary";
  size?: "sm" | "lg";
  disabled?: boolean;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  size = "sm",
  type = "primary",
  disabled = false,
  handleClick,
}: ButtonProps) {
  const baseStyles =
    "rounded-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed";
  const typeStyles = {
    primary:
      "bg-indigo-600 text-white enabled:hover:bg-indigo-700 focus:ring-indigo-600",
    danger:
      "bg-rose-100 text-red-500 enabled:hover:bg-rose-200 focus:ring-rose-500 border border-red-500",
    secondary:
      "bg-white text-indigo-600 enabled:hover:bg-gray-50 focus:ring-gray-200 border border-gray-200",
  };
  const sizeStyles = {
    sm: "px-4 py-2 text-sm 3xl:text-xl 3xl:px-5 3xl:py-3",
    lg: "w-full px-4 py-3 text-base font-semibold 3xl:text-2xl",
  };

  return (
    <button
      className={`${baseStyles} ${typeStyles[type]} ${sizeStyles[size]}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
