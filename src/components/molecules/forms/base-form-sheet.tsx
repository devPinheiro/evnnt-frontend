import { useMediaQuery } from "@hooks";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/sheet";
import { cn } from "@utils";
import type { ReactNode } from "react";

const narrowQuery = "(max-width: 639px)";

export type BaseFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Extra classes on the sheet panel (width/scroll are preset for EHR-style forms). */
  className?: string;
};

/**
 * Form shell — **Sheet only** (EHR `BaseFormSheet` + `TeamSwitcher` pattern):
 * right panel on `sm+`, bottom sheet on narrow viewports.
 */
export function BaseFormSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: BaseFormSheetProps) {
  const isNarrow = useMediaQuery(narrowQuery);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isNarrow ? "bottom" : "right"}
        className={cn(
          "flex flex-col gap-4 overflow-hidden",
          isNarrow
            ? "max-h-[min(92vh,800px)]"
            : "h-full max-h-screen sm:min-w-[min(35vw,280px)] sm:max-w-[min(672px,40vw)] sm:w-full",
          className,
        )}
      >
        <SheetHeader className="shrink-0 text-left">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
