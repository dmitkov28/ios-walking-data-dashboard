import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
export default function CurrentYearRecords({
  className,
  topMonth,
  topDay,
  streaks,
}: {
  className: string;
  topMonth: DataPoint;
  topDay: DataPoint;
  streaks: {
    streak_30: DataPoint[];
    streak_20: DataPoint[];
    streak_10: DataPoint[];
  };
}) {
  return (
    <div
      className={twMerge(
        "p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm bg-white",
        className
      )}
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🏆 {new Date().getFullYear()}'s Records
      </h1>

      <div className="space-y-6">
        <ul className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
          <li className="p-4 rounded-md  flex flex-col items-center bg-blue-50">
            <span className="font-bold text-lg mb-1 ">🏆 Top Day</span>
            <span className="text-xl font-semibold ">{topDay.distance} km</span>
            <span className="text-sm text-gray-500 italic">
              {format(new Date(topDay.timestamp), "d MMMM")}
            </span>
          </li>
          <li className="p-4 rounded-md  flex flex-col items-center bg-blue-50">
            <span className="font-bold text-lg mb-1 t">🏆 Top Month</span>
            <span className="text-xl font-semibold ">
              {topMonth.distance.toFixed(2)} km
            </span>
            <span className="text-sm text-gray-500 italic">
              {format(new Date(topMonth.timestamp), "MMMM")}
            </span>
          </li>
        </ul>

        <div className="pt-4 border-t border-gray-200">
          <h2 className="font-bold text-lg text-center mb-4 ">🚀 Streaks</h2>
          {streaks.streak_10.length === 0 &&
          streaks.streak_20.length === 0 &&
          streaks.streak_30.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <span className="text-4xl mb-2 block">🎯</span>
              <p>No streaks yet this year</p>
            </div>
          ) : (
            <ul className="w-full grid md:grid-cols-3 grid-cols-1 gap-3">
              {streaks.streak_10.length > 0 && (
                <li className="p-3 rounded-md  flex flex-col items-center bg-blue-50">
                  <span className="font-bold">🚀 Top 10+km Streak</span>
                  <span className="text-sm ">
                    {streaks.streak_10.length} days (
                    {format(streaks.streak_10[0].timestamp, "d MMMM")} -{" "}
                    {format(streaks.streak_10.slice(-1)[0].timestamp, "d MMMM")}
                    )
                  </span>
                </li>
              )}
              {streaks.streak_20.length > 0 && (
                <li className="p-3 rounded-md bg-blue-50 flex flex-col items-center">
                  <span className="font-bold ">🚀 Top 20+km Streak</span>
                  <span className="text-sm ">
                    {streaks.streak_20.length} days (
                    {format(streaks.streak_20[0].timestamp, "d MMMM")} -{" "}
                    {format(streaks.streak_20.slice(-1)[0].timestamp, "d MMMM")}
                    )
                  </span>
                </li>
              )}
              {streaks.streak_30.length > 0 && (
                <li className="p-3 rounded-md bg-blue-50 flex flex-col items-center">
                  <span className="font-bold ">🚀 Top 30+km Streak</span>
                  <span className="text-sm ">
                    {streaks.streak_30.length} days (
                    {format(streaks.streak_30[0].timestamp, "d MMMM")} -{" "}
                    {format(streaks.streak_30.slice(-1)[0].timestamp, "d MMMM")}
                    )
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
