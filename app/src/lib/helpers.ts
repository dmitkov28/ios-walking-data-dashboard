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



export const getDaysInCurrentYear = () => {
  const year = new Date().getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  return isLeap ? 366 : 365;
}