import { cn } from "@utils";
import { type LabelHTMLAttributes, forwardRef } from "react";

/** Pair with `Input` via `htmlFor` + matching `id`. */
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: primitive; callers set htmlFor
    <label ref={ref} className={cn("text-xs font-medium text-evvnt-n500", className)} {...props} />
  ),
);
Label.displayName = "Label";
