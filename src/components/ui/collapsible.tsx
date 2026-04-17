import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@utils";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    className={cn(
      "focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:outline-none",
      className,
    )}
    {...props}
  />
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.CollapsibleTrigger.displayName;

const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn("overflow-hidden", className)}
    {...props}
  />
));
CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
