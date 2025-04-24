import { BarChart } from "@tremor/react";
import { twMerge } from "tailwind-merge";

export default function AppBarChart({
  data,
  title,
  subtitle,
  className,
  categories = ["distance"],
  colors = ["blue"],
}: {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  className?: string;
  categories?: string[];
  colors?: string[];
}) {
  return (
    <div className={twMerge("", className)}>
      <h3 className="font-bold text-center text-xl mb-3">{title}</h3>
      {subtitle && (
        <h4 className="text-gray-400 text-sm text-center mb-2">{subtitle}</h4>
      )}
      <BarChart
        className="h-72"
        data={data}
        index="timestamp"
        categories={categories}
        colors={colors}
        yAxisWidth={92}
        showAnimation={true}
        showLegend={true}
        valueFormatter={(v) => `${v.toFixed(1)} km`}
      />
    </div>
  );
}

export function AppBarChartLoading({ className }: { className?: string }) {
  return (
    <div className={twMerge("animate-pulse", className)}>
      <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto mb-3" />
      <div className="h-4 w-1/3 bg-gray-300 rounded mx-auto mb-4" />
      <div className="h-72 bg-gray-100 rounded border" />
    </div>
  );
}
