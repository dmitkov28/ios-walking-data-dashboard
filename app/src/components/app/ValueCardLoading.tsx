export function ValueCardLoading() {
  return (
    <div className="p-8 rounded-md flex flex-col gap-1 md:min-w-[230px] w-full border shadow-md animate-pulse">
      <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-1/2 bg-gray-300 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
    </div>
  );
}
