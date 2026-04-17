import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { type ComponentProps, forwardRef } from "react";

import { cn } from "@utils";

import { buttonVariants } from "./button";

const Pagination = ({ className, ...props }: ComponentProps<"nav">) => (
  <nav
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = ComponentProps<"a"> & {
  isActive?: boolean;
};

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "primary" : "outline",
        size: "sm",
        className: "h-8 min-w-8 justify-center px-2.5",
      }),
      !isActive && "font-normal",
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: ComponentProps<"a">) => (
  <a
    aria-label="Go to previous page"
    className={cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      "h-8 gap-1 px-2.5 pl-2",
      className,
    )}
    {...props}
  >
    <ChevronLeft className="size-4" />
    <span>Previous</span>
  </a>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: ComponentProps<"a">) => (
  <a
    aria-label="Go to next page"
    className={cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      "h-8 gap-1 px-2.5 pr-2",
      className,
    )}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="size-4" />
  </a>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex size-8 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="size-4 text-evvnt-n400" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
