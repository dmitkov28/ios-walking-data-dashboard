import { format, parse } from "date-fns";

export const formatDate = (date: string) => {
  const [day, month, year] = date.replace(".", "").split(" ");

  const formattedDate = format(
    parse(`${day} ${month} ${year}`, "d MMMM yyyy", new Date()),
    "yyyy-MM-dd"
  );

  return formattedDate;
};

export const earthCircumference = 40075;

export const distanceToMoon = 384400;
