import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { cn } from "@utils";
import { useFormContext } from "react-hook-form";

import type { FormFieldBaseProps, FormOption } from "./types";

export type FSelectProps = FormFieldBaseProps & {
  options: readonly FormOption[];
  placeholder?: string;
  /** Extra classes on the trigger (EHR `triggerClassname`) */
  triggerClassName?: string;
};

/**
 * Encapsulated select — EHR `FSelect` pattern using Radix `Select` (`@ui/select`).
 */
export function FSelect({
  name,
  label,
  description,
  options,
  placeholder = "Select…",
  disabled,
  isRequired,
  triggerClassName,
}: FSelectProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel isRequired={isRequired}>{label}</FormLabel>
          <Select disabled={disabled} onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  "aria-[invalid=true]:border-evvnt-danger aria-[invalid=true]:bg-evvnt-danger-subtle",
                  triggerClassName,
                )}
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
