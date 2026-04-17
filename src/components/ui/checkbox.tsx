import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@utils";
import { Check } from "lucide-react";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-4 shrink-0 rounded-evvnt-sm border border-evvnt-n300 bg-white ring-offset-evvnt-mist focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-evvnt-core data-[state=checked]:bg-evvnt-core data-[state=checked]:text-white",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="size-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
