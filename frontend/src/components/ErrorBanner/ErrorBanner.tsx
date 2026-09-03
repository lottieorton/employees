import type { ReactNode } from "react";

interface ErrorBannerProps {
  children: ReactNode;
}
export default function ErrorBanner({ children }: ErrorBannerProps) {
  return (
    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
      <i
        className="fa-solid fa-circle-exclamation text-rose-500"
        aria-label="Warning icon"
      ></i>
      <p className="text-sm 3xl:text-xl">{children}</p>
    </div>
  );
}
