import { cn } from "@utils";
import { type TextareaHTMLAttributes, forwardRef } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[80px] w-full resize-y rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2 text-sm text-evvnt-ink outline-none placeholder:text-evvnt-n400 focus:border-evvnt-muted focus:ring-1 focus:ring-evvnt-muted",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
