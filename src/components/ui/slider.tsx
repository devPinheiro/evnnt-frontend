import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@utils";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-evvnt-n200">
      <SliderPrimitive.Range className="absolute h-full bg-evvnt-core" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-4 rounded-full border border-evvnt-core bg-white shadow focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
