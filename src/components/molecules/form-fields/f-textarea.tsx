import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Textarea, type TextareaProps } from "@ui/textarea";
import { cn } from "@utils";
import { useFormContext } from "react-hook-form";

import type { FormFieldBaseProps } from "./types";

export type FTextareaProps = FormFieldBaseProps & {
  placeholder?: string;
  className?: string;
  textareaProps?: Omit<
    TextareaProps,
    "name" | "value" | "onChange" | "onBlur" | "disabled" | "placeholder"
  >;
};

/**
 * Encapsulated textarea — EHR `FTextarea` pattern.
 */
export function FTextarea({
  name,
  label,
  description,
  disabled,
  isRequired,
  placeholder,
  className,
  textareaProps,
}: FTextareaProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel isRequired={isRequired}>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...textareaProps}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "min-h-[88px] resize-y",
                fieldState.invalid && "border-evvnt-danger",
                className,
              )}
              {...field}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
