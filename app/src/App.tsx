import { format } from "date-fns";
import { lazy, Suspense } from "react";
import { AppBarChartLoading } from "./components/app/AppBarChartLoading";
import { HorizontalBarChartLoading } from "./components/app/HorizontalBarLoading";
import { TrendLoading } from "./components/app/TrendLoading";
import { ValueCardLoading } from "./components/app/ValueCardLoading";
import { distanceToMoon, earthCircumference } from "./lib/helpers";
import useData, {
  computeCaloriesBurned,
  computeProjectedTotalYearlyDistance,
  computeTotalKgCO2Saved,
} from "./lib/useData";

import CurrentYearRecords from "./components/app/CurrentYearRecords";
import OfflineBadge from "./components/app/OfflineBadge";

const AppBarChart = lazy(() => import("./components/app/Bar"));
const Trend = lazy(() => import("./components/app/Trend"));
const HorizontalBarChart = lazy(() => import("./components/app/HorizontalBar"));
const ValueCard = lazy(() => import("./components/app/ValueCard"));

function App() {
  const {
    allTimeMonthlyAverage,
    currentMonthAverage,
    averages,
    topMonthly,
    topMonthlyAvg,
    topWalks,
    topYearly,
    total,
    sortedData,
    monthOverMonth,
    today,
    loading,
    streak_30,
    streak_20,
    streak_10,
    topMonthCurrentYear,
    topDayCurrentYear,
    currentYearStreaks
  } = useData();

  return (
    <main className="flex flex-col gap-8 w-full md:px-12 px-2">
      <h1 className="text-4xl font-extrabold my-8 text-center flex md:flex-row flex-col gap-4 items-center justify-center">
        🚶 My walks {!navigator.onLine && <OfflineBadge />}
      </h1>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-center">Loading data...</p>
        </div>
      ) : (
        <>
          <div className="flex gap-3 flex-col md:flex-row items-stretch">
            <Suspense fallback={<ValueCardLoading />}>
              <ValueCard
                title="Total distance"
                value={`${new Intl.NumberFormat("en-US").format(total)} km`}
                description={`🌎 ${(total / earthCircumference).toFixed(
                  2
                )}x the circumference of Earth`}
                secondDescription={`🌕 ${(
                  (total / distanceToMoon) *
                  100
                ).toFixed(0)}% of the way to the Moon`}
              >
                <span>
                  ⛽ {(computeTotalKgCO2Saved(total) / 1000).toFixed(2)} tons of
                  CO
                  <sub>2</sub> saved
                </span>
              </ValueCard>
            </Suspense>
            <Suspense fallback={<ValueCardLoading />}>
              <ValueCard
                title="Daily Average Distance"
                value={`${currentMonthAverage.distance.toFixed(2)} km`}
              >
                <div>
                  🏆 All-time Average:{" "}
                  <span className="font-bold">
                    {allTimeMonthlyAverage.toFixed(2)} km
                  </span>
                </div>
              </ValueCard>
            </Suspense>
            <Suspense fallback={<ValueCardLoading />}>
              <ValueCard
                className={
                  monthOverMonth >= 0 ? "text-emerald-400" : "text-red-500"
                }
                title="Month over Month Change"
                icon={monthOverMonth >= 0 ? "⬆️" : "⬇️"}
                value={`${monthOverMonth.toFixed(2)}%`}
              >
                <div>
                  📈 Projected Yearly Distance:{" "}
                  <span className="font-bold">
                    {computeProjectedTotalYearlyDistance(
                      currentMonthAverage.distance
                    ).toFixed(2)}{" "}
                    km
                  </span>
                </div>
              </ValueCard>
            </Suspense>
            <Suspense fallback={<ValueCardLoading />}>
              <ValueCard
                title={`📅 Today (${format(
                  new Date(today.timestamp),
                  "dd MMM yy"
                )})`}
                value={`${today.distance.toFixed(2)} km`}
              >
                <span className="text-gray-400 italic font-medium">
                  🔥 ~ {computeCaloriesBurned(today.distance).toFixed(0)}{" "}
                  calories
                </span>
              </ValueCard>
            </Suspense>
          </div>
          <div className="my-12">
            <Suspense fallback={<TrendLoading />}>
              <Trend
                title="📈 Daily distance (last 20 days)"
                data={sortedData.slice(-20)}
              />
            </Suspense>
          </div>
          <div className="my-12">
            <Suspense fallback={<TrendLoading />}>
              <Trend title="📈 Monthly avg. distance" data={averages} />
            </Suspense>
          </div>
          <div className="grid grid-cols-3 gap-12 md:gap-2 my-12">
            <h2 className="col-span-3 text-center my-6 text-2xl font-bold">
              🚀 Streaks
            </h2>
            <Suspense fallback={<AppBarChartLoading />}>
              <AppBarChart
                className="col-span-3 md:col-span-1"
                data={streak_10}
                title={"🚀 Longest 10km+ streak"}
                subtitle={`${format(
                  new Date(streak_10[0].timestamp),
                  "dd MMM yy"
                )} - ${format(
                  new Date(streak_10[streak_10.length - 1].timestamp),
                  "dd MMM yy"
                )} (${streak_10.length} days)`}
              />
            </Suspense>
            <Suspense fallback={<AppBarChartLoading />}>
              <AppBarChart
                className="col-span-3 md:col-span-1"
                data={streak_20}
                title={`🚀 Longest 20km+ streak`}
                subtitle={`${format(
                  new Date(streak_20[0].timestamp),
                  "dd MMM yy"
                )} - ${format(
                  new Date(streak_20[streak_20.length - 1].timestamp),
                  "dd MMM yy"
                )} (${streak_20.length} days)`}
              />
            </Suspense>
            <Suspense fallback={<AppBarChartLoading />}>
              <AppBarChart
                className="col-span-3 md:col-span-1"
                data={streak_30}
                title={"🚀 Longest 30km+ streak"}
                subtitle={`${format(
                  new Date(streak_30[0].timestamp),
                  "dd MMM yy"
                )} - ${format(
                  new Date(streak_30[streak_30.length - 1].timestamp),
                  "dd MMM yy"
                )} (${streak_30.length} days)`}
              />
            </Suspense>
          </div>
          <div className="grid grid-cols-4 gap-2 my-12">
            <h2 className="col-span-4 text-center my-6 text-2xl font-bold">
              🏆 Records
            </h2>
            <Suspense fallback={<p></p>}>
              <CurrentYearRecords
                topMonth={topMonthCurrentYear}
                topDay={topDayCurrentYear}
                streaks={currentYearStreaks}
                className="col-span-4"
              />
            </Suspense>
            <Suspense fallback={<HorizontalBarChartLoading />}>
              <HorizontalBarChart
                className="md:col-span-1 col-span-4"
                title="🏆 Top Days (km/day)"
                data={topWalks}
              />
            </Suspense>
            <Suspense fallback={<HorizontalBarChartLoading />}>
              <HorizontalBarChart
                className="md:col-span-1 col-span-4"
                title="🏆 Top Months (avg. km/month)"
                data={topMonthlyAvg}
              />
            </Suspense>
            <Suspense fallback={<HorizontalBarChartLoading />}>
              <HorizontalBarChart
                className="md:col-span-1 col-span-4"
                title="🏆 Top Months (km/month)"
                data={topMonthly}
              />
            </Suspense>
            <Suspense fallback={<HorizontalBarChartLoading />}>
              <HorizontalBarChart
                className="md:col-span-1 col-span-4"
                title="🏆 Top Years (km/year)"
                data={topYearly}
              />
            </Suspense>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
