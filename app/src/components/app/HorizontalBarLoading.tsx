
export function HorizontalBarChartLoading() {
  return (
    <div className={"mx-auto max-w-lg animate-pulse rounded-md border border-gray-300 p-2"}>
      <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-full bg-gray-100 rounded mb-5" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
