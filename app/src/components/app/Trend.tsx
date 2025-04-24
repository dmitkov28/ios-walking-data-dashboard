import { LineChart } from "@tremor/react";

export default function Trend({
  data,
  title,
}: {
  data: DataPoint[];
  title: string;
}) {
  return (
    <>
      <h3 className="text-2xl text-center font-bold">{title}</h3>
      <LineChart
        className="mt-4 h-72"
        data={data}
        index="timestamp"
        yAxisWidth={65}
        categories={["distance"]}
        colors={["blue"]}
        valueFormatter={(v) => `${v.toFixed(1)} km`}
        showAnimation={true}
      />
    </>
  );
}


export function TrendLoading() {
  return (
    <div>
      <div className="text-2xl text-center font-bold h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
      <div className="mt-4 h-72 w-full border rounded bg-gray-100 animate-pulse" />
    </div>
  );
}
