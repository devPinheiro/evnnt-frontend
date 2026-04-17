/** Hall capacity model — ported from evvnt-planner-v2.html */

export const AISLE_W = 1.5;
export const CHAIR_CL = 0.6;
export const TABLE_GAP = 1.0;
export const HEAD_AREA = 20;
export const BAR_AREA = 15;
export const DANCE_AREA = 25;

export type TableShape = "round" | "rect";

export type HallInputs = {
  hallL: number;
  hallW: number;
  guests: number;
  seatsPerTable: number;
  aisles: number;
  stageA: number;
  headTable: boolean;
  barBuffet: boolean;
  danceFloor: boolean;
  shape: TableShape;
  tableDim1: number;
  tableDim2: number;
};

export type HallResult = {
  totalArea: number;
  aisleArea: number;
  deductions: number;
  usableArea: number;
  eff: number;
  tableFit: number;
  maxSeats: number;
  spacePerGuest: number;
  fits: boolean;
};

export function computeHall(inputs: HallInputs): HallResult {
  const L = inputs.hallL;
  const W = inputs.hallW;
  const guests = inputs.guests;
  const seats = inputs.seatsPerTable;
  const aisles = inputs.aisles;
  const stageA = inputs.stageA;
  const headA = inputs.headTable ? HEAD_AREA : 0;
  const barA = inputs.barBuffet ? BAR_AREA : 0;
  const danceA = inputs.danceFloor ? DANCE_AREA : 0;

  const totalArea = L * W;
  const aisleArea = aisles * AISLE_W * L;
  const deductions = stageA + headA + barA + danceA + aisleArea;
  const usableArea = Math.max(0, totalArea - deductions);

  let eff: number;
  if (inputs.shape === "round") {
    const d = inputs.tableDim1;
    const totalD = d + CHAIR_CL * 2 + TABLE_GAP;
    eff = totalD * totalD;
  } else {
    const tw = inputs.tableDim1;
    const tl = inputs.tableDim2;
    eff = (tw + CHAIR_CL * 2 + TABLE_GAP) * (tl + TABLE_GAP);
  }

  const tableFit = Math.floor(usableArea / eff);
  const maxSeats = tableFit * seats;
  const spacePerGuest = guests > 0 ? usableArea / guests : 0;
  const fits = maxSeats >= guests;

  return {
    totalArea,
    aisleArea,
    deductions,
    usableArea,
    eff,
    tableFit,
    maxSeats,
    spacePerGuest,
    fits,
  };
}

export type OverallStatus = "ok" | "warn" | "bad";

export function hallOverallStatus(
  fits: boolean,
  spacePerGuest: number,
): { status: OverallStatus; label: string } {
  if (fits && spacePerGuest >= 1.5) {
    return { status: "ok", label: "✓ Fits comfortably" };
  }
  if (fits) {
    return { status: "warn", label: "⚠ Fits but tight" };
  }
  return { status: "bad", label: "✗ Insufficient capacity" };
}

export type SpaceRating = "comfortable" | "adequate" | "tight";

export function spaceRating(spacePerGuest: number): { rating: SpaceRating; label: string } {
  if (spacePerGuest >= 1.5) {
    return {
      rating: "comfortable",
      label: "Comfortable · well above the 1.5m² minimum",
    };
  }
  if (spacePerGuest >= 1.1) {
    return {
      rating: "adequate",
      label: "Adequate · meets the 1.1m² minimum",
    };
  }
  return {
    rating: "tight",
    label: "Tight · below recommended minimum",
  };
}
