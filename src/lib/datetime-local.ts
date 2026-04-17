/** `datetime-local` value shape: `YYYY-MM-DDTHH:mm` (local). */

export function toDatetimeLocalString(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day}T${h}:${min}`;
}

export function parseDatetimeLocal(s: string | undefined): Date | undefined {
  if (s === undefined || !String(s).trim()) {
    return undefined;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** `HH:mm` for `<input type="time" />` */
export function timePartFromDatetimeLocal(s: string | undefined): string {
  const d = parseDatetimeLocal(s);
  if (!d) {
    return "";
  }
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
