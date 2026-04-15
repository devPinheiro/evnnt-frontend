import type { AuthUser } from "@/store/auth.store";

/** Display helpers for dashboard chrome (EHR-style: derived view state from auth user). */
export function getInitialsFromUser(user: AuthUser | null | undefined): string {
  const name = user?.name?.trim();
  const email = user?.email;
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "";
    const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    const out = (a + b).toUpperCase();
    return out || "U";
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

export function greetingFirstName(user: AuthUser | null | undefined): string {
  const name = user?.name?.trim();
  const email = user?.email;
  if (name) {
    return name.split(/\s+/)[0] ?? "there";
  }
  return email?.split("@")[0] ?? "there";
}

export function displayNameFromUser(user: AuthUser | null | undefined): string {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email) return user.email;
  return "Guest";
}
