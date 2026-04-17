import { Slot } from "@radix-ui/react-slot";
import { MoreHorizontal, Slash } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

import { cn } from "@utils";

type BreadcrumbProps = ComponentPropsWithoutRef<"nav"> & {
  separator?: ReactNode;
};

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = forwardRef<HTMLOListElement, ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-xs text-evvnt-n500 sm:gap-2.5 sm:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-evvnt-core", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      className={cn("font-semibold text-evvnt-ink normal-case", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: HTMLAttributes<HTMLLIElement>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5 text-evvnt-n300", className)}
    {...props}
  >
    {children ?? <Slash className="text-evvnt-n300" />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
