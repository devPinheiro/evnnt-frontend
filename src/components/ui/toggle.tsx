import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@utils";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

const Toggle = forwardRef<
  ElementRef<typeof TogglePrimitive.Root>,
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-transparent px-2.5 py-1.5 text-xs font-medium text-evvnt-n500 transition-colors hover:bg-evvnt-n50 hover:text-evvnt-ink focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-evvnt-muted data-[state=on]:bg-evvnt-tint data-[state=on]:text-evvnt-core",
      className,
    )}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
