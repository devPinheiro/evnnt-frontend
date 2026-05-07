import { cn } from "@utils";
import type { GuestStatus } from "./types";

export type GuestStatusBadgeProps = {
  status: GuestStatus;
  className?: string;
};

function statusClass(status: GuestStatus) {
  if (status === "checked-in") return "bg-evvnt-ink text-evvnt-tint";
  if (status === "yes") return "bg-evvnt-success-subtle text-evvnt-success";
  if (status === "awaiting") return "bg-evvnt-warn-subtle text-evvnt-warn";
  if (status === "declined") return "bg-evvnt-danger-subtle text-evvnt-danger";
  if (status === "invited") return "bg-evvnt-tint text-evvnt-core";
  return "bg-evvnt-n100 text-evvnt-n500";
}

function statusLabel(status: GuestStatus) {
  if (status === "checked-in") return "Checked in";
  if (status === "yes") return "RSVP'd yes";
  if (status === "awaiting") return "Awaiting";
  if (status === "declined") return "Declined";
  if (status === "invited") return "Invited";
  return "No-show";
}

export function GuestStatusBadge({ status, className }: GuestStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-[10px] font-semibold",
        statusClass(status),
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
