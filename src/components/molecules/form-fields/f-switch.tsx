import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Switch } from "@ui/switch";
import { cn } from "@utils";
import { useFormContext } from "react-hook-form";

import type { FormFieldBaseProps } from "./types";

export type FSwitchProps = FormFieldBaseProps & {
  /** Class on the label next to the switch */
  labelClassName?: string;
  /** Class on the outer `FormItem` (e.g. card wrapper) */
  className?: string;
};

/**
 * Boolean field — EHR `FSwitch` pattern (switch + label + optional help).
 */
export function FSwitch({
  name,
  label,
  description,
  disabled,
  labelClassName,
  className,
}: FSwitchProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-0.5">
              <FormLabel className={cn("!mt-0 cursor-pointer font-medium", labelClassName)}>
                {label}
              </FormLabel>
              {description ? (
                <FormDescription className="!mt-0 text-xs leading-relaxed">
                  {description}
                </FormDescription>
              ) : null}
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className="shrink-0"
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
