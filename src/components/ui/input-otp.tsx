import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, useContext } from "react";

import { cn } from "@utils";

const InputOTP = forwardRef<ElementRef<typeof OTPInput>, ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        className,
        containerClassName,
      )}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center", className)} {...props} />
  ),
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const ctx = useContext(OTPInputContext);
  const slot = ctx.slots[index];
  if (!slot) {
    return null;
  }
  const { char, hasFakeCaret, isActive } = slot;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-white text-sm text-evvnt-ink shadow-sm transition-all",
        "first:rounded-l-evvnt-md last:rounded-r-evvnt-md",
        isActive &&
          "z-10 border-evvnt-core ring-2 ring-evvnt-muted ring-offset-2 ring-offset-evvnt-mist",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-evvnt-core" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    <div ref={ref} aria-hidden className="flex items-center" {...props}>
      <Minus className="size-4 text-evvnt-n400" />
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
