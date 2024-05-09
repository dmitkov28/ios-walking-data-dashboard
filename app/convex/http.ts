import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { api } from "../convex/_generated/api";
import { formatDate } from "../src/lib/helpers";

export const processData = httpAction(async (ctx, request) => {
  const rawData = await request.text();
  const parsedData = JSON.parse(`[${rawData}]`);
  const processedData: {
    date: string;
    latestTimestamp: string;
    distance: number;
  } = parsedData.reduce(
    (
      acc: {
        date: string;
        distance: number;
      },
      curr: {
        distance: number;
        timestamp: string;
      }
    ) => {
      acc.date = formatDate(curr.timestamp);
      acc.distance += curr.distance;
      return acc;
    },
    { date: "", distance: 0 }
  );
  await ctx.runMutation(api.functions.addDailyData, { data: processedData });
  return Response.json({ status: 201 });
});

const http = httpRouter();

http.route({
  path: "/addData",
  method: "POST",
  handler: processData,
});

export default http;
