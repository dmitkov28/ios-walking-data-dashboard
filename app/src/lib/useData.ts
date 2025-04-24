import { useQuery } from "convex/react";
import {
  differenceInDays,
  format,
  getDaysInMonth,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { useMemo } from "react";
import { api } from "../../convex/_generated/api";

export default function useData() {
  const data = useQuery(api.functions.getData);
  const loading = data === undefined;

  const sortedData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }, [data]);

  const averages = useMemo(() => {
    const result: DataPoint[] = [];
    sortedData
      .map((item) => ({ ...item }))
      .forEach((item) => {
        const lastPushedItem = result[result.length - 1];
        if (!lastPushedItem) {
          result.push(item);
        } else {
          const lastPushedItemDate = new Date(lastPushedItem.timestamp);
          const itemDate = new Date(item.timestamp);

          if (isSameMonth(new Date(lastPushedItemDate), new Date(itemDate))) {
            lastPushedItem.distance += item.distance;
          } else {
            if (!isNaN(item.distance) && item.timestamp) {
              result.push(item);
            }
          }
        }
      });

    const avgs = result.map((item) => {
      const daysInMonth = getDaysInMonth(new Date(item.timestamp));

      if (isSameMonth(new Date(), new Date(item.timestamp))) {
        return {
          timestamp: item.timestamp,
          distance:
            item.distance /
            (differenceInDays(new Date(), new Date(item.timestamp)) + 1),
        };
      }

      return {
        timestamp: item.timestamp,
        distance: item.distance / daysInMonth,
      };
    });

    return avgs.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }, [sortedData]);

  const total = useMemo(() => {
    return [...sortedData].reduce((acc, curr) => acc + curr.distance, 0);
  }, [sortedData]);

  const monthlyAverage = useMemo(() => {
    return total / sortedData.length;
  }, [sortedData, total]);

  const topWalks = useMemo(() => {
    return [...sortedData].sort((a, b) => b.distance - a.distance).slice(0, 10);
  }, [sortedData]);

  const topMonthly = useMemo(() => {
    const result: DataPoint[] = [];
    sortedData
      .map((item) => ({ ...item }))
      .forEach((item) => {
        const lastPushedItem = result[result.length - 1];
        if (!lastPushedItem) {
          result.push(item);
        } else {
          const lastPushedItemDate = new Date(lastPushedItem.timestamp);
          const itemDate = new Date(item.timestamp);
          if (isSameMonth(new Date(lastPushedItemDate), new Date(itemDate))) {
            lastPushedItem.distance += item.distance;
          } else {
            result.push(item);
          }
        }
      });

    const sortedResult = result.sort((a, b) => b.distance - a.distance);
    return sortedResult.slice(0, 10).map((item) => {
      return {
        timestamp: format(new Date(item.timestamp), "MMM yyy"),
        distance: item.distance,
      };
    });
  }, [sortedData]);

  const topMonthlyAvg = useMemo(() => {
    const sortedResult = [...averages].sort((a, b) => b.distance - a.distance);
    return sortedResult.slice(0, 10).map((item) => {
      return {
        timestamp: format(new Date(item.timestamp), "MMM yyy"),
        distance: item.distance,
      };
    });
  }, [averages]);

  const topYearly = useMemo(() => {
    const result: DataPoint[] = [];
    sortedData
      .map((item) => ({ ...item }))
      .forEach((item) => {
        const lastPushedItem = result[result.length - 1];
        if (!lastPushedItem) {
          result.push(item);
        } else {
          const lastPushedItemDate = new Date(lastPushedItem.timestamp);
          const itemDate = new Date(item.timestamp);
          if (isSameYear(new Date(lastPushedItemDate), new Date(itemDate))) {
            lastPushedItem.distance += item.distance;
          } else {
            result.push(item);
          }
        }
      });

    const sortedResult = result.sort((a, b) => b.distance - a.distance);
    return sortedResult.slice(0, 10).map((item) => {
      return {
        timestamp: format(new Date(item.timestamp), "yyy"),
        distance: item.distance,
      };
    });
  }, [sortedData]);

  const monthOverMonth = useMemo(() => {
    const currentMonth = averages[averages.length - 1];
    const prevMonth = averages[averages.length - 2];
    if (!currentMonth || !prevMonth || isNaN(prevMonth.distance)) {
      return 0;
    }

    return (
      ((currentMonth.distance - prevMonth.distance) / prevMonth.distance) * 100
    );
  }, [averages]);

  const today = useMemo(() => {
    if (!sortedData) {
      return { timestamp: "", distance: 0 };
    }
    return sortedData[sortedData.length - 1];
  }, [sortedData]);

  const streak_30 = useMemo(() => {
    return calculateStreak(sortedData, 30);
  }, [sortedData]);

  const streak_20 = useMemo(() => {
    return calculateStreak(sortedData, 20);
  }, [sortedData]);

  const streak_10 = useMemo(() => {
    return calculateStreak(sortedData, 10);
  }, [sortedData]);

  return {
    monthlyAverage,
    topMonthly,
    topMonthlyAvg,
    topWalks,
    topYearly,
    total,
    sortedData,
    averages,
    monthOverMonth,
    today,
    loading,
    streak_30,
    streak_20,
    streak_10,
  };
}

const calculateStreak = (data: DataPoint[], threshold: number) => {
  const streaks: DataPoint[][] = [];
  let currentStreak: DataPoint[] = [];

  data.forEach((item) => {
    if (Math.round(item.distance) >= threshold) {
      currentStreak.push(item);
    } else {
      if (currentStreak.length) {
        streaks.push(currentStreak);
        currentStreak = [];
      }
    }
  });
  if (currentStreak.length) {
    streaks.push(currentStreak);
  }
  const longestStreak = streaks.sort((a, b) => a.length - b.length).pop();
  return longestStreak as DataPoint[];
};
