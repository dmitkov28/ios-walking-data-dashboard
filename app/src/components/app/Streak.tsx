import { Card, Tracker, type Color } from "@tremor/react";
import { format } from "date-fns";
import { useMemo } from "react";

interface Tracker {
  color: Color;
  tooltip: string;
}

const transformData = (item: DataPoint): Tracker => {
  return {
    color: "emerald",
    tooltip: `${item.distance.toFixed(1)} km (${format(new Date(item.timestamp), "dd MMM yy")})`,
  };
};

export function Streak({ title, data }: { title: string; data: DataPoint[] }) {
  const streak = useMemo(() => {
    return data.map(transformData);
  }, [data]);

  return (
    <Card className="mx-auto max-w-md">
      <p className="text-tremor-default flex items-center justify-between">
        <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          {title}
        </span>
        <span className="text-tremor-content dark:text-dark-tremor-content">
          {format(new Date(data[0].timestamp), "dd MMM yy")} -{" "}
          {format(new Date(data[streak.length - 1].timestamp), "dd MMM yy")}
        </span>
      </p>
      <Tracker data={streak} className="mt-2" />
    </Card>
  );
}
