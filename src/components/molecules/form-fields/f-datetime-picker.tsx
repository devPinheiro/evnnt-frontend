import { DateTimePicker, type DateTimePickerProps } from "@ui/datetime-picker";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { cn } from "@utils";
import { useFormContext } from "react-hook-form";

import type { FormFieldBaseProps } from "./types";

export type FDateTimePickerProps = FormFieldBaseProps &
  Pick<DateTimePickerProps, "placeholder" | "disablePastDates" | "minDate"> & {
    className?: string;
  };

/**
 * RHF + Zod wrapper — EHR `FDatePicker` + time, Evnnt `DateTimePicker` control.
 */
export function FDateTimePicker({
  name,
  label,
  description,
  disabled,
  isRequired,
  placeholder,
  disablePastDates,
  minDate,
  className,
}: FDateTimePickerProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel isRequired={isRequired}>{label}</FormLabel>
          <FormControl>
            <DateTimePicker
              ref={field.ref}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              placeholder={placeholder}
              disablePastDates={disablePastDates}
              minDate={minDate}
              className={cn(fieldState.invalid && "border-evvnt-danger", className)}
              aria-invalid={fieldState.invalid}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
