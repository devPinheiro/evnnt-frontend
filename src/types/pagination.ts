/**
 * Cursor / page-style list payload (EHR `TPagination` shape).
 * Use with `useInfiniteQueryData` when the API returns `results` + `next` / `previous` URLs.
 */
export type TPagination<TItem> = {
  count: number;
  next: string;
  previous: string;
  results: TItem[];
};
