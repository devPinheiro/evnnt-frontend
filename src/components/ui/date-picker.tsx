import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@utils";

import { buttonVariants } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DatePickerProps = {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "md",
            className: "justify-start text-left font-normal",
          }),
          !date && "text-evvnt-n400",
          className,
        )}
      >
        <CalendarIcon className="mr-2 size-4 shrink-0" />
        {date ? format(date, "PPP") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
