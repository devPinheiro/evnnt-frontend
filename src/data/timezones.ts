/** Common IANA zones for event scheduling — used by create-event and other flows. */
export const COMMON_TIMEZONES = [
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT)" },
  { value: "Africa/Accra", label: "Africa/Accra (GMT)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York (ET)" },
] as const;
