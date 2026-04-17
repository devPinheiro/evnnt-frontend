/** Cost estimate model — ported from evvnt-planner-v2.html */

export type CostCategoryId = "food" | "drinks" | "souv" | "sec";

export type CostLineItem = {
  id: string;
  name: string;
  description: string;
  unitCost: number;
  qtyPerGuest: number;
};

export const COST_CAT_LABELS: Record<CostCategoryId, string> = {
  food: "Food & catering",
  drinks: "Drinks & bar",
  souv: "Souvenirs & aso-ebi",
  sec: "Security & logistics",
};

export const COST_CAT_COLORS: Record<CostCategoryId, string> = {
  food: "#059669",
  drinks: "#4B1FA8",
  souv: "#D97706",
  sec: "#DC2626",
};

export function categoryTotal(lines: CostLineItem[], guests: number): number {
  let total = 0;
  for (const line of lines) {
    total += line.unitCost * line.qtyPerGuest * guests;
  }
  return total;
}

export type CostTotals = Record<CostCategoryId, number>;

export function computeAllCategoryTotals(
  byCat: Record<CostCategoryId, CostLineItem[]>,
  guests: number,
): { base: number; totals: CostTotals } {
  const totals: CostTotals = {
    food: categoryTotal(byCat.food, guests),
    drinks: categoryTotal(byCat.drinks, guests),
    souv: categoryTotal(byCat.souv, guests),
    sec: categoryTotal(byCat.sec, guests),
  };
  const base = totals.food + totals.drinks + totals.souv + totals.sec;
  return { base, totals };
}

export function benchmarkTier(perHead: number): "Budget" | "Mid-range" | "Premium" {
  if (perHead >= 50_000) {
    return "Premium";
  }
  if (perHead >= 25_000) {
    return "Mid-range";
  }
  return "Budget";
}
