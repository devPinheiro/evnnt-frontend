import {
  parseDatetimeLocal,
  timePartFromDatetimeLocal,
  toDatetimeLocalString,
} from "@/lib/datetime-local";
import { cn } from "@utils";
import { format, isBefore, startOfDay, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type ChangeEvent, forwardRef } from "react";
import type { Matcher } from "react-day-picker";

import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DateTimePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  /** Hide calendar days before today (local). */
  disablePastDates?: boolean;
  /** Earliest selectable calendar day (local start-of-day compared). */
  minDate?: Date;
};

/**
 * EHR-style date + time: read-only trigger opens a popover with calendar + native time stepper.
 * Value is `datetime-local` string for RHF / Zod.
 */
export const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      value,
      onChange,
      onBlur,
      placeholder = "Select date and time",
      disabled,
      className,
      id,
      "aria-invalid": ariaInvalid,
      disablePastDates,
      minDate,
    },
    ref,
  ) {
    const selected = parseDatetimeLocal(value);

    const disabledDays: Matcher | undefined =
      disablePastDates || minDate
        ? (date) => {
            if (disablePastDates && isBefore(startOfDay(date), startOfToday())) {
              return true;
            }
            if (minDate && isBefore(startOfDay(date), startOfDay(minDate))) {
              return true;
            }
            return false;
          }
        : undefined;

    const handleDaySelect = (day: Date | undefined) => {
      if (!onChange) {
        return;
      }
      if (!day) {
        onChange("");
        return;
      }
      const prev = parseDatetimeLocal(value);
      const h = prev ? prev.getHours() : 18;
      const m = prev ? prev.getMinutes() : 0;
      const next = new Date(day);
      next.setHours(h, m, 0, 0);
      onChange(toDatetimeLocalString(next));
    };

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!onChange) {
        return;
      }
      const t = e.target.value;
      if (!t) {
        return;
      }
      const base = parseDatetimeLocal(value) ?? new Date();
      const [hh, mm] = t.split(":").map((n) => Number.parseInt(n, 10));
      if (Number.isNaN(hh) || Number.isNaN(mm)) {
        return;
      }
      base.setHours(hh, mm, 0, 0);
      onChange(toDatetimeLocalString(base));
    };

    const label = selected ? format(selected, "PPP 'at' p") : null;

    return (
      <Popover>
        <PopoverTrigger
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex w-full items-center gap-2 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2 text-left text-sm text-evvnt-ink outline-none transition-colors",
            "hover:bg-evvnt-mist/50 focus:border-evvnt-muted focus:ring-1 focus:ring-evvnt-muted",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "text-evvnt-n400",
            ariaInvalid && "border-evvnt-danger",
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-evvnt-n500" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium">{label ?? placeholder}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
          <div className="flex flex-col">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleDaySelect}
              disabled={disabledDays}
            />
            <div className="flex items-center gap-2 border-t border-evvnt-n200 px-3 py-2.5">
              <span className="shrink-0 text-xs font-medium text-evvnt-n500">Time</span>
              <input
                type="time"
                step={60}
                value={timePartFromDatetimeLocal(value)}
                onChange={handleTimeChange}
                disabled={disabled || !selected}
                className={cn(
                  "min-w-0 flex-1 rounded-evvnt-sm border border-evvnt-n200 bg-white px-2 py-1.5 text-sm text-evvnt-ink",
                  "outline-none focus:border-evvnt-muted focus:ring-1 focus:ring-evvnt-muted",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

DateTimePicker.displayName = "DateTimePicker";
