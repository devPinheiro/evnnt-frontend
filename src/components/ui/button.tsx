import { cn } from "@utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md";
};

/** Shared classes for `Button`, `AlertDialogAction`, link-as-button patterns. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" && "rounded-evvnt-sm px-3 py-1.5 text-xs",
    size === "md" && "rounded-evvnt-md px-4 py-2 text-sm",
    variant === "primary" &&
      "bg-evvnt-core text-white hover:bg-evvnt-deep focus-visible:ring-2 focus-visible:ring-evvnt-vivid focus-visible:ring-offset-2 focus-visible:ring-offset-evvnt-mist focus-visible:outline-none",
    variant === "secondary" &&
      "border border-evvnt-n200 bg-white text-evvnt-ink hover:bg-evvnt-n50",
    variant === "outline" &&
      "border border-evvnt-muted bg-evvnt-tint text-evvnt-core hover:bg-evvnt-mist",
    variant === "ghost" && "text-evvnt-vivid hover:bg-evvnt-tint",
    className,
  );
}

/** Primitive button — Evvnt tokens; EHR maps to `Button` + cva variants. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
