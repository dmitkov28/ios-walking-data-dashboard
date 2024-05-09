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
