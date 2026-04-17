import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@utils";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

const ToggleGroup = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  />
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex min-w-0 items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-transparent px-2.5 py-1.5 text-xs font-medium text-evvnt-n500 transition-colors hover:bg-evvnt-n50 hover:text-evvnt-ink focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-evvnt-muted data-[state=on]:bg-evvnt-tint data-[state=on]:text-evvnt-core",
      className,
    )}
    {...props}
  />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
