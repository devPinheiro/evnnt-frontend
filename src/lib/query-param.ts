/** Parse a query param from a full URL (e.g. pagination `next` links) — ported from EHR `getQueryParam`. */
export function getQueryParam(url: string | undefined | null, param: string): number | undefined {
  if (!url) return undefined;
  try {
    const urlObject = new URL(url);
    const raw = urlObject.searchParams.get(param);
    if (raw === null) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  } catch {
    return undefined;
  }
}
