import { useQuery } from "convex/react";
import {
  compareAsc,
  differenceInDays,
  format,
  getDaysInMonth,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import { getDaysInCurrentYear } from "./helpers";
import { db } from "./db";

export default function useData() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState<DataPoint[] | undefined>(
    undefined
  );

  const convexData = useQuery(api.functions.getData);

  useEffect(() => {
    const loadCachedData = async () => {
      const data = await db.data.toArray();
      if (data && data.length > 0) {
        setCachedData(data);
      }
    };

    void loadCachedData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (convexData && isOnline) {
      const syncData = async () => {
        await db.data.clear();
        await db.data.bulkAdd(convexData);
        console.log("Data successfully synced.");
      };

      void syncData();
    }
  }, [convexData, isOnline]);

  const data = isOnline && convexData ? convexData : cachedData;
  const loading = data === undefined;

  const sortedData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [sortedData]);

  const total = useMemo(() => {
    return sortedData.reduce((acc, curr) => acc + curr.distance, 0);
  }, [sortedData]);

  const allTimeMonthlyAverage = useMemo(() => {
    if (sortedData.length === 0) return 0;
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

  const currentMonthAverage = useMemo(() => {
    if (averages.length === 0) return { timestamp: "", distance: 0 };
    return averages[averages.length - 1];
  }, [averages]);

  const monthOverMonth = useMemo(() => {
    const prevMonth =
      averages.length >= 2 ? averages[averages.length - 2] : null;
    if (
      !currentMonthAverage ||
      !prevMonth ||
      isNaN(prevMonth.distance) ||
      prevMonth.distance === 0
    ) {
      return 0;
    }

    return (
      ((currentMonthAverage.distance - prevMonth.distance) /
        prevMonth.distance) *
      100
    );
  }, [averages, currentMonthAverage]);

  const today = useMemo(() => {
    if (!sortedData || sortedData.length === 0) {
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

  const topMonthCurrentYear = useMemo(() => {
    return averages
      .filter((avg) => {
        if (new Date(avg.timestamp).getFullYear() == new Date().getFullYear()) {
          return avg;
        }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(-1)[0];
  }, [averages]);

  const currentYear = useMemo(() => {
    return sortedData
      .filter(
        (datapoint) =>
          new Date(datapoint.timestamp).getFullYear() ==
          new Date().getFullYear()
      )
      .sort((a, b) => compareAsc(a.timestamp, b.timestamp));
  }, [sortedData]);

  const topDayCurrentYear = useMemo(() => {
    return [...currentYear]
      .sort((a, b) => a.distance - b.distance)
      .slice(-1)[0];
  }, [sortedData]);

  const currentYearStreaks = useMemo(() => {
    const streak_30 = calculateStreak(currentYear, 30);
    const streak_20 = calculateStreak(currentYear, 20);
    const streak_10 = calculateStreak(currentYear, 10);
    return { streak_30, streak_20, streak_10 };
  }, [sortedData]);

  return {
    allTimeMonthlyAverage,
    currentMonthAverage,
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
    topMonthCurrentYear,
    topDayCurrentYear,
    currentYearStreaks,
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

  if (streaks.length === 0) return [];

  const longestStreak = streaks.sort((a, b) => b.length - a.length)[0];
  return longestStreak;
};

export const computeCaloriesBurned = (distance: number) => {
  // Calories burned = Weight (kg) × Distance (km) × Calorie burn rate per kg/km
  const weight = 85.5;
  const burnRate = 0.9;

  return weight * burnRate * distance;
};

export const computeProjectedTotalYearlyDistance = (
  currentAverageDistance: number
) => {
  const daysInCurrentYear = getDaysInCurrentYear();
  return daysInCurrentYear * currentAverageDistance;
};

export const computeTotalKgCO2Saved = (distanceWalked: number) => {
  const smallCarCO2 = 0.15; // kg per km
  return smallCarCO2 * distanceWalked;
};
