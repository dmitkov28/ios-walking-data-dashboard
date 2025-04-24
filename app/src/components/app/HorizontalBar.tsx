import { BarList, Card } from "@tremor/react";
import { twMerge } from "tailwind-merge";

const formatData = (item: DataPoint) => {
  return {
    name: item.timestamp,
    value: parseFloat(item.distance.toFixed(1)),
  };
};

export default function HorizontalBarChart({
  data,
  title,
  className,
}: {
  data: DataPoint[];
  title: string;
  className?: string;
}) {
  const formattedData = data.map(formatData);
  return (
    <Card className={twMerge("mx-auto max-w-lg", className)}>
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        {title}
      </h3>
      <p className="my-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
        <span>Month</span> <span>Distance (km)</span>
      </p>
      <BarList showAnimation={true} color={"blue"} data={formattedData} />
    </Card>
  );
}

export function HorizontalBarChartLoading({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={twMerge("mx-auto max-w-lg animate-pulse", className)}>
      <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-full bg-gray-100 rounded mb-5" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded" />
        ))}
      </div>
    </Card>
  );
}
