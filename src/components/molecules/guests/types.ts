export type GuestStatus = "checked-in" | "yes" | "awaiting" | "declined" | "invited" | "no-show";

export type GuestGroup = "VIP" | "General" | "Family" | "Media" | "Corporate";

export type GuestRow = {
  id: string;
  initials: string;
  name: string;
  email: string;
  status: GuestStatus;
  group: GuestGroup;
  table: string;
  ticket: string;
  plusOne: string;
  invitedAt: string;
};
