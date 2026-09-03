import type { ReactNode } from "react";

interface LoadingBannerProps {
  children: ReactNode;
}
export default function LoadingBanner({ children }: LoadingBannerProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-md">
      <i
        className="fa-solid fa-spinner animate-spin text-indigo-600 text-lg"
        aria-label="Loading icon"
      ></i>
      <span className="text-sm font-medium text-indigo-900 animate-pulse">
        {children}
      </span>
    </div>
  );
}
