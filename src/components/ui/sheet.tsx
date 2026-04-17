import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@utils";
import { X } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  forwardRef,
} from "react";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef<
  ElementRef<typeof SheetPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-evvnt-ink/40 backdrop-blur-[1px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

type SheetContentProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  showClose?: boolean;
};

const sheetSideClass = {
  top: "inset-x-0 top-0 border-b rounded-b-evvnt-xl data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
  bottom:
    "inset-x-0 bottom-0 max-h-[90vh] border-t rounded-t-evvnt-xl data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
} as const;

const SheetContent = forwardRef<ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, showClose = true, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col gap-4 border border-evvnt-n200 bg-white p-6 shadow-[0_8px_40px_-8px_rgb(26_9_51_/_18%)] transition-transform duration-300 ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          sheetSideClass[side],
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close
            className="absolute top-4 right-4 rounded-evvnt-sm p-1 text-evvnt-n400 opacity-70 transition-opacity hover:bg-evvnt-n100 hover:text-evvnt-ink hover:opacity-100 focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="size-4" />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = forwardRef<
  ElementRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none text-evvnt-ink", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = forwardRef<
  ElementRef<typeof SheetPrimitive.Description>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-evvnt-n500", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
