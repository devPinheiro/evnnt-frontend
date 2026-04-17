import { cn } from "@utils";
import type { HTMLAttributes } from "react";

const variants = {
  default: "border-transparent bg-evvnt-tint text-evvnt-core",
  secondary: "border-transparent bg-evvnt-n100 text-evvnt-n700",
  outline: "border-evvnt-n200 bg-white text-evvnt-ink",
  success: "border-transparent bg-evvnt-success-subtle text-evvnt-success",
  warning: "border-transparent bg-evvnt-warn-subtle text-evvnt-warn",
  destructive: "border-transparent bg-evvnt-danger-subtle text-evvnt-danger",
} as const;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
};

/** Small status / count pill — Evvnt tokens. */
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
