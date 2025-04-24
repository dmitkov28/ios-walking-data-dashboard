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

export const computeCaloriesBurned = (distance: number) => {
  // Calories burned = Weight (kg) × Distance (km) × Calorie burn rate per kg/km
  const weight = 85.5;
  const burnRate = 0.9;

  return weight * burnRate * distance;
};
