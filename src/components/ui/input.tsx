import { cn } from "@utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2 text-sm text-evvnt-ink outline-none placeholder:text-evvnt-n400 focus:border-evvnt-muted focus:ring-1 focus:ring-evvnt-muted",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
