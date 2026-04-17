import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ComponentProps } from "react";
import { Toaster as Sonner, toast } from "sonner";

import { cn } from "@utils";

type ToasterProps = ComponentProps<typeof Sonner>;

/** Toaster + `toast` re-export — aligned with EHR `@ui/sonner` (Sonner + Evvnt tokens). */
export function Toaster({ className, toastOptions, icons, ...props }: ToasterProps) {
  return (
    <Sonner
      className={cn("toaster group", className)}
      position="top-right"
      duration={5000}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(
            "flex w-full max-w-sm items-center gap-4 rounded-evvnt-md border border-evvnt-n200 bg-white px-4 py-3 shadow-lg group-[.toaster]:pointer-events-auto",
            toastOptions?.classNames?.toast,
          ),
          error: cn("border-l-4 border-l-evvnt-danger", toastOptions?.classNames?.error),
          success: cn("border-l-4 border-l-evvnt-success", toastOptions?.classNames?.success),
          warning: cn("border-l-4 border-l-evvnt-warn", toastOptions?.classNames?.warning),
          info: cn("border-l-4 border-l-evvnt-vivid", toastOptions?.classNames?.info),
          icon: cn("size-8 shrink-0", toastOptions?.classNames?.icon),
          content: cn(
            "flex flex-1 flex-col gap-0.5 py-0.5 pr-2",
            toastOptions?.classNames?.content,
          ),
          title: cn("text-sm font-semibold text-evvnt-ink", toastOptions?.classNames?.title),
          description: cn("text-sm text-evvnt-n500", toastOptions?.classNames?.description),
          actionButton: cn(
            "cursor-pointer rounded-evvnt-sm px-3 py-1.5 text-xs font-medium text-evvnt-core hover:bg-evvnt-tint",
            toastOptions?.classNames?.actionButton,
          ),
          cancelButton: cn(
            "rounded-evvnt-sm px-3 py-1.5 text-xs text-evvnt-n500 hover:bg-evvnt-n100",
            toastOptions?.classNames?.cancelButton,
          ),
        },
      }}
      icons={{
        success: <CheckCircle2 className="size-8 text-evvnt-success" aria-hidden />,
        info: <Info className="size-8 text-evvnt-vivid" aria-hidden />,
        warning: <AlertTriangle className="size-8 text-evvnt-warn" aria-hidden />,
        error: <AlertCircle className="size-8 text-evvnt-danger" aria-hidden />,
        ...icons,
      }}
      {...props}
    />
  );
}

export { toast };
