import { cn } from "@utils";
import { type ComponentPropsWithoutRef, type HTMLAttributes, forwardRef } from "react";

const variants = {
  default: "border-evvnt-n200 bg-white text-evvnt-ink",
  info: "border-evvnt-muted/40 bg-evvnt-tint text-evvnt-core",
  success: "border-evvnt-success-light bg-evvnt-success-subtle text-evvnt-success",
  warning: "border-evvnt-warn-light bg-evvnt-warn-subtle text-evvnt-warn",
  destructive: "border-evvnt-danger-light bg-evvnt-danger-subtle text-evvnt-danger",
} as const;

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", role = "alert", ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(
        "relative w-full rounded-evvnt-lg border px-4 py-3 text-sm [&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

export const AlertTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h5">>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm leading-relaxed opacity-90", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";
