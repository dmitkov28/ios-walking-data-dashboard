import { twMerge } from "tailwind-merge";

export function AppBarChartLoading() {
  return (
    <div className={twMerge("animate-pulse")}>
      <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto mb-3" />
      <div className="h-4 w-1/3 bg-gray-300 rounded mx-auto mb-4" />
      <div className="h-72 bg-gray-100 rounded border" />
    </div>
  );
}
