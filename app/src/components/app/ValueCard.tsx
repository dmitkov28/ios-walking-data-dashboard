import { twMerge } from "tailwind-merge";
import { Card } from "../ui/card";

export default function ValueCard({
  value,
  title,
  icon,
  className,
  description,
  secondDescription,
}: {
  value: string;
  title: string;
  icon?: string;
  className?: string;
  description?: string;
  secondDescription?: string;
}) {
  return (
    <Card className="p-8 rounded-md flex flex-col gap-1 md:min-w-[230px] w-full">
      <p className="font-light text-xl">{title}</p>
      <span className={twMerge("font-bold text-2xl", className)}>
        {icon} {value}
      </span>
      <span className="mt-3 ">{description}</span>
      <span className="mt-1 ">{secondDescription}</span>
    </Card>
  );
}
