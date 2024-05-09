import { format } from "date-fns";
import AppBarChart from "./components/app/Bar";
import HorizontalBarChart from "./components/app/HorizontalBar";
import Trend from "./components/app/Trend";
import ValueCard from "./components/app/ValueCard";
import useData from "./lib/useData";
import { distanceToMoon, earthCircumference } from "./lib/helpers";

function App() {
  const {
    monthlyAverage,
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
  } = useData();

  return (
    <main className="flex flex-col gap-8 w-full md:px-12 px-2">
      <h1 className="text-4xl font-extrabold my-8 text-center flex md:flex-row flex-col gap-4 items-center justify-center">
        🚶 My walks{" "}
      </h1>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-center">Loading data...</p>
        </div>
      ) : (
        <>
          <div className="flex gap-3 flex-col md:flex-row items-stretch">
            <ValueCard
              title="Total distance"
              value={`${new Intl.NumberFormat("en-US").format(total)} km`}
              description={`🌎 ${(total / earthCircumference).toFixed(2)}x the circumference of Earth`}
              secondDescription={`🌕 ${((total / distanceToMoon) * 100).toFixed(0)}% of the way to the Moon`}
            />
            <ValueCard
              title="Daily Average Distance"
              value={`${monthlyAverage.toFixed(2)} km`}
            />
            <ValueCard
              className={
                monthOverMonth >= 0 ? "text-emerald-400" : "text-red-500"
              }
              title="Month over Month Change"
              icon={monthOverMonth >= 0 ? "⬆️" : "⬇️"}
              value={`${monthOverMonth.toFixed(2)}%`}
            />

            <ValueCard
              title={`📅 Today (${format(new Date(today.timestamp), "dd MMM yy")})`}
              value={`${today.distance.toFixed(2)} km`}
            />
          </div>
          <div className="my-12">
            <Trend title="📈 Daily distance" data={sortedData} />
          </div>
          <div className="my-12">
            <Trend title="📈 Monthly avg. distance" data={averages} />
          </div>
          <div className="grid grid-cols-3 gap-12 md:gap-2 my-12">
            <h2 className="col-span-3 text-center my-6 text-2xl font-bold">
              🚀 Streaks
            </h2>
            <AppBarChart
              className="col-span-3 md:col-span-1"
              data={streak_10}
              title={"🚀 Longest 10km+ streak"}
              subtitle={`${format(new Date(streak_10[0].timestamp), "dd MMM yy")} - ${format(new Date(streak_10[streak_10.length - 1].timestamp), "dd MMM yy")}`}
            />

            <AppBarChart
              className="col-span-3 md:col-span-1"
              data={streak_20}
              title={`🚀 Longest 20km+ streak`}
              subtitle={`${format(new Date(streak_20[0].timestamp), "dd MMM yy")} - ${format(new Date(streak_20[streak_20.length - 1].timestamp), "dd MMM yy")}`}
            />
            <AppBarChart
              className="col-span-3 md:col-span-1"
              data={streak_30}
              title={"🚀 Longest 30km+ streak"}
              subtitle={`${format(new Date(streak_30[0].timestamp), "dd MMM yy")} - ${format(new Date(streak_30[streak_30.length - 1].timestamp), "dd MMM yy")}`}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 my-12">
            <h2 className="col-span-4 text-center my-6 text-2xl font-bold">
              🏆 Records
            </h2>
            <HorizontalBarChart
              className="md:col-span-1 col-span-4"
              title="🏆 Top Days (km/day)"
              data={topWalks}
            />
            <HorizontalBarChart
              className="md:col-span-1 col-span-4"
              title="🏆 Top Months (avg. km/month)"
              data={topMonthlyAvg}
            />
            <HorizontalBarChart
              className="md:col-span-1 col-span-4"
              title="🏆 Top Months (km/month)"
              data={topMonthly}
            />
            <HorizontalBarChart
              className="md:col-span-1 col-span-4"
              title="🏆 Top Years (km/year)"
              data={topYearly}
            />
          </div>
        </>
      )}
    </main>
  );
}

export default App;
