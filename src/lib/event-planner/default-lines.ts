import type { CostCategoryId, CostLineItem } from "./cost-compute";

function line(
  id: string,
  name: string,
  description: string,
  unitCost: number,
  qtyPerGuest: number,
): CostLineItem {
  return { id, name, description, unitCost, qtyPerGuest };
}

export const DEFAULT_COST_LINES: Record<CostCategoryId, CostLineItem[]> = {
  food: [
    line("food-1", "Main course", "Jollof / fried rice + protein", 5000, 1),
    line("food-2", "Small chops", "Puff puff, samosa, spring roll", 2500, 1),
    line("food-3", "Catering staff & service", "Waiters, chefs, service charge", 3000, 1),
    line("food-4", "Dessert & cake", "Per person estimate", 2000, 1),
  ],
  drinks: [
    line("drinks-1", "Soft drinks & water", "Coke, Fanta, Eva water", 1500, 1),
    line("drinks-2", "Beer & malt", "Heineken, Guinness, Maltina", 2500, 1),
    line("drinks-3", "Spirits & wines", "Premium bar — per person estimate", 1500, 0.5),
    line("drinks-4", "Bartenders & bar setup", "Staff + equipment flat ÷ guests", 750, 1),
  ],
  souv: [
    line("souv-1", "Souvenir / gift bag", "Per guest — keepsake item", 2500, 1),
    line("souv-2", "Aso-ebi fabric", "Host contribution per person", 1500, 1),
  ],
  sec: [
    line("sec-1", "Security personnel", "Guards — flat fee ÷ guests", 833, 1),
    line("sec-2", "Generator & power", "Backup power — flat ÷ guests", 333, 1),
  ],
};
