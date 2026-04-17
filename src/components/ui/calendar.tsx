import { cn } from "@utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import "react-day-picker/style.css";

export type CalendarProps = DayPickerProps;

function CalendarNavButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-evvnt-sm border border-evvnt-n200 bg-white text-evvnt-ink",
        "hover:bg-evvnt-n50 focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}

/** Single-calendar wrapper around react-day-picker v9 with Evvnt-friendly class names. */
export function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("rdp w-fit"),
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        month_caption: "flex h-9 items-center justify-center px-1",
        caption_label: "text-sm font-medium text-evvnt-ink",
        nav: "absolute top-3 flex w-[calc(100%-1rem)] items-center justify-between px-1",
        button_previous: "",
        button_next: "",
        weekdays: "flex",
        weekday: "w-9 text-center text-[0.8rem] font-normal text-evvnt-n500",
        week: "mt-2 flex w-full",
        day: cn(
          "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:rounded-evvnt-md",
        ),
        day_button: cn(
          "size-9 rounded-evvnt-md p-0 font-normal text-evvnt-ink",
          "hover:bg-evvnt-tint aria-selected:opacity-100",
        ),
        selected:
          "[&_button]:bg-evvnt-core [&_button]:text-white [&_button]:hover:bg-evvnt-deep [&_button]:focus:bg-evvnt-core",
        today: "[&_button]:bg-evvnt-tint [&_button]:text-evvnt-core",
        outside:
          "text-evvnt-n400 opacity-50 aria-selected:bg-evvnt-n100 aria-selected:text-evvnt-n500 aria-selected:opacity-30",
        disabled: "text-evvnt-n300 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
        PreviousMonthButton: (buttonProps) => <CalendarNavButton {...buttonProps} />,
        NextMonthButton: (buttonProps) => <CalendarNavButton {...buttonProps} />,
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
