export function fmtFull(n: number): string {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}

export function fmtShort(n: number): string {
  if (n >= 1e9) {
    return `₦${(n / 1e9).toFixed(1)}B`;
  }
  if (n >= 1e6) {
    return `₦${(n / 1e6).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (n >= 1e3) {
    return `₦${Math.round(n / 1e3)}K`;
  }
  return `₦${Math.round(n)}`;
}
