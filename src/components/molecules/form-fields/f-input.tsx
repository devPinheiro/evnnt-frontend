import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input, type InputProps } from "@ui/input";
import { cn } from "@utils";
import { useFormContext } from "react-hook-form";

import type { FormFieldBaseProps } from "./types";

export type FInputProps = FormFieldBaseProps & {
  placeholder?: string;
  type?: InputProps["type"];
  autoComplete?: string;
  className?: string;
  /** Extra props for the inner `<Input />` (excluding controlled keys). */
  inputProps?: Omit<
    InputProps,
    "name" | "value" | "onChange" | "onBlur" | "disabled" | "placeholder" | "type" | "autoComplete"
  >;
};

/**
 * Encapsulated text input — EHR `FInput` pattern (label, help, validation).
 */
export function FInput({
  name,
  label,
  description,
  disabled,
  isRequired,
  placeholder,
  type,
  autoComplete,
  className,
  inputProps,
}: FInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel isRequired={isRequired}>{label}</FormLabel>
          <FormControl>
            <Input
              {...inputProps}
              placeholder={placeholder}
              type={type}
              autoComplete={autoComplete}
              disabled={disabled}
              className={cn(fieldState.invalid && "border-evvnt-danger", className)}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
