import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

type DataPoint = {
  timestamp: string;
  distance: number;
};

export const getData = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.db.query("data").withIndex("by_year").collect();
    return data.reduce((acc: DataPoint[], curr) => {
      acc.push(
        ...curr.data.map((item) => ({
          timestamp: item.date,
          distance: item.distance,
        }))
      );
      return acc;
    }, []);
  },
});

export const addDailyData = mutation({
  args: {
    data: v.object({
      date: v.string(),
      distance: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const currentYear = await ctx.db
      .query("data")
      .filter((q) => q.eq(q.field("year"), new Date().getFullYear()))
      .first();

    if (currentYear?._id) {
      const lastEntry = currentYear.data[currentYear.data.length - 1];
      if (lastEntry.date === args.data.date) {
        currentYear.data[currentYear.data.length - 1].distance =
          args.data.distance;
      } else {
        currentYear.data.push({
          date: args.data.date,
          distance: args.data.distance,
        });
      }
      await ctx.db.patch(currentYear._id, { data: currentYear.data });
    }
  },
});
