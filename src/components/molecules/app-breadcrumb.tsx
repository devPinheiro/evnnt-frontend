import { Link, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Fragment, useMemo } from "react";

import { cn } from "@utils";

const SEGMENT_LABELS: Record<string, string> = {
  events: "Events",
  planner: "Planner",
  login: "Sign in",
  signup: "Sign up",
};

function labelForSegment(segment: string): string {
  const lower = segment.toLowerCase();
  if (SEGMENT_LABELS[lower]) return SEGMENT_LABELS[lower];
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export type AppBreadcrumbProps = {
  className?: string;
};

/**
 * Path-driven crumbs from the current URL (EHR `HeaderBreadcrumb` pattern, TanStack `Link`).
 */
export function AppBreadcrumb({ className }: AppBreadcrumbProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    let acc = "";
    return segments.map((seg, index) => {
      acc += `/${seg}`;
      const isLast = index === segments.length - 1;
      return {
        key: acc,
        label: labelForSegment(seg),
        href: isLast ? undefined : acc,
      };
    });
  }, [pathname]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={cn("min-w-0", className)}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.key}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
