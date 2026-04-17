import {
  COST_CAT_COLORS,
  COST_CAT_LABELS,
  type CostCategoryId,
  type CostLineItem,
  benchmarkTier,
  computeAllCategoryTotals,
} from "@/lib/event-planner/cost-compute";
import { DEFAULT_COST_LINES } from "@/lib/event-planner/default-lines";
import { fmtFull, fmtShort } from "@/lib/event-planner/format-ngn";
import {
  AISLE_W,
  BAR_AREA,
  DANCE_AREA,
  HEAD_AREA,
  type HallInputs,
  computeHall,
  hallOverallStatus,
  spaceRating,
} from "@/lib/event-planner/hall-compute";
import { FloorPlanCanvas } from "@organisms/event-planner/floor-plan-canvas";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { cn } from "@utils";
import { Calendar, Check, Download, LayoutGrid, Save } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

const COST_CATS: CostCategoryId[] = ["food", "drinks", "souv", "sec"];

function cloneDefaultLines(): Record<CostCategoryId, CostLineItem[]> {
  return {
    food: DEFAULT_COST_LINES.food.map((l) => ({ ...l })),
    drinks: DEFAULT_COST_LINES.drinks.map((l) => ({ ...l })),
    souv: DEFAULT_COST_LINES.souv.map((l) => ({ ...l })),
    sec: DEFAULT_COST_LINES.sec.map((l) => ({ ...l })),
  };
}

export function EventPlannerPage() {
  const [tab, setTab] = useState<"hall" | "cost">("hall");

  const [hallL, setHallL] = useState(30);
  const [hallW, setHallW] = useState(20);
  const [guests, setGuests] = useState(300);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [aisles, setAisles] = useState(2);
  const [stageA, setStageA] = useState(30);
  const [headTable, setHeadTable] = useState(true);
  const [barBuffet, setBarBuffet] = useState(true);
  const [danceFloor, setDanceFloor] = useState(false);
  const [shape, setShape] = useState<HallInputs["shape"]>("round");
  const [tableDim1, setTableDim1] = useState(1.8);
  const [tableDim2, setTableDim2] = useState(3.0);

  const [costBuffer, setCostBuffer] = useState(10);
  const [linesByCat, setLinesByCat] = useState(cloneDefaultLines);
  const [openCats, setOpenCats] = useState<Record<CostCategoryId, boolean>>({
    food: true,
    drinks: true,
    souv: true,
    sec: true,
  });

  const hall = useMemo(
    () =>
      computeHall({
        hallL,
        hallW,
        guests,
        seatsPerTable,
        aisles,
        stageA,
        headTable,
        barBuffet,
        danceFloor,
        shape,
        tableDim1,
        tableDim2,
      }),
    [
      hallL,
      hallW,
      guests,
      seatsPerTable,
      aisles,
      stageA,
      headTable,
      barBuffet,
      danceFloor,
      shape,
      tableDim1,
      tableDim2,
    ],
  );
  const overall = hallOverallStatus(hall.fits, hall.spacePerGuest);
  const spaceLbl = spaceRating(hall.spacePerGuest);

  const { base, totals } = useMemo(
    () => computeAllCategoryTotals(linesByCat, guests),
    [linesByCat, guests],
  );
  const grand = base * (1 + costBuffer / 100);
  const perHead = guests > 0 ? grand / guests : 0;
  const tier = benchmarkTier(perHead);

  const tableHint =
    shape === "round"
      ? `Round table · ∅ ${tableDim1}m · ${seatsPerTable} seats`
      : `Rectangular table · ${tableDim1}m × ${tableDim2}m · ${seatsPerTable} seats`;

  const alerts = useMemo(() => {
    const list: { id: string; type: "bad" | "warn" | "ok"; node: ReactNode }[] = [];
    const { fits, maxSeats, tableFit, spacePerGuest: sp } = hall;
    if (!fits) {
      const shortfall = guests - maxSeats;
      list.push({
        id: "capacity-shortfall",
        type: "bad",
        node: (
          <>
            <strong>Capacity shortfall:</strong> Your hall fits {maxSeats.toLocaleString()} seats (
            {tableFit} tables × {seatsPerTable}) but you need {guests.toLocaleString()}. You’re
            short by {shortfall} seats. Consider: increasing table size, reducing guest count by{" "}
            {shortfall}, or sourcing a larger venue.
          </>
        ),
      });
    }
    if (sp < 1.1 && fits) {
      list.push({
        id: "spacing-tight",
        type: "warn",
        node: (
          <>
            <strong>Very tight spacing:</strong> {sp.toFixed(2)}m² per guest is below the
            comfortable minimum of 1.5m². Guests will feel cramped. Consider reducing the guest list
            or removing the dance floor.
          </>
        ),
      });
    } else if (sp < 1.5 && fits) {
      list.push({
        id: "spacing-adequate",
        type: "warn",
        node: (
          <>
            <strong>Adequate but not comfortable:</strong> {sp.toFixed(2)}m² per guest meets the
            minimum but is below the comfortable threshold of 1.5m². For a premium experience,
            consider reducing the guest count by {Math.ceil(guests - hall.usableArea / 1.5)}.
          </>
        ),
      });
    }
    if (fits && sp >= 1.5) {
      list.push({
        id: "good-to-go",
        type: "ok",
        node: (
          <>
            <strong>Good to go:</strong> {tableFit} tables accommodate {maxSeats} guests with{" "}
            {sp.toFixed(2)}m² per person — comfortable for a seated event.
          </>
        ),
      });
    }
    return list;
  }, [hall, guests, seatsPerTable]);

  const areaRows = useMemo(() => {
    const items: { label: string; val: number; col: string }[] = [
      { label: "Total hall area", val: hall.totalArea, col: "#4B1FA8" },
      {
        label: `Aisle space (${aisles} × ${AISLE_W}m)`,
        val: -hall.aisleArea,
        col: "#9CA3AF",
      },
    ];
    if (stageA > 0) {
      items.push({ label: "Stage / altar", val: -stageA, col: "#9CA3AF" });
    }
    if (headTable) {
      items.push({ label: "Head table zone", val: -HEAD_AREA, col: "#9CA3AF" });
    }
    if (barBuffet) {
      items.push({ label: "Bar / buffet zone", val: -BAR_AREA, col: "#9CA3AF" });
    }
    if (danceFloor) {
      items.push({ label: "Dance floor", val: -DANCE_AREA, col: "#9CA3AF" });
    }
    items.push({
      label: "Usable seating area",
      val: hall.usableArea,
      col: "#059669",
    });
    return items;
  }, [hall, aisles, stageA, headTable, barBuffet, danceFloor]);

  function selectShape(next: HallInputs["shape"]) {
    setShape(next);
    if (next === "round") {
      setTableDim1(1.8);
    } else {
      setTableDim1(1.0);
      setTableDim2(3.0);
    }
  }

  function stepSeats(delta: number) {
    setSeatsPerTable((s) => Math.min(14, Math.max(4, s + delta)));
  }

  function updateLine(cat: CostCategoryId, id: string, patch: Partial<CostLineItem>) {
    setLinesByCat((prev) => ({
      ...prev,
      [cat]: prev[cat].map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }));
  }

  function addLine(cat: CostCategoryId, name: string) {
    const row: CostLineItem = {
      id: `${cat}-${Date.now()}`,
      name,
      description: "Custom item",
      unitCost: 0,
      qtyPerGuest: 1,
    };
    setLinesByCat((prev) => ({ ...prev, [cat]: [...prev[cat], row] }));
  }

  function toggleCat(cat: CostCategoryId) {
    setOpenCats((o) => ({ ...o, [cat]: !o[cat] }));
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {/* Module chrome — scoped to planner (app shell provides sidebar) */}
      <header className="flex min-h-14 shrink-0 flex-col gap-3 border-b border-evvnt-n200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-0">
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/events">Events</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="max-w-[140px] truncate text-[13px] font-medium text-evvnt-n500 sm:max-w-[240px]">
                Okonkwo Wedding
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Planner</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <span className="inline-flex items-center gap-1 rounded-full border border-evvnt-success-light bg-evvnt-success-subtle px-2 py-0.5 text-[11px] text-evvnt-success">
            <Check className="size-2.5" strokeWidth={2} />
            Saved
          </span>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-evvnt-md border border-evvnt-muted px-3.5 py-2 text-[13px] font-medium text-evvnt-core transition-colors hover:bg-evvnt-tint"
          >
            <Download className="size-[13px]" strokeWidth={1.3} />
            Export PDF
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-evvnt-md bg-evvnt-core px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-evvnt-deep"
          >
            <Save className="size-[13px]" strokeWidth={1.2} />
            Save to event
          </button>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-evvnt-mist">
        <div className="flex shrink-0 items-center gap-0 overflow-x-auto border-b border-evvnt-n200 bg-white px-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setTab("hall")}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[2.5px] px-3 py-3.5 text-[13px] font-medium transition-colors sm:px-[18px]",
              tab === "hall"
                ? "border-evvnt-vivid text-evvnt-core"
                : "border-transparent text-evvnt-n400 hover:text-evvnt-ink",
            )}
          >
            <LayoutGrid className="size-3.5" strokeWidth={1.2} />
            Hall management
          </button>
          <button
            type="button"
            onClick={() => setTab("cost")}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[2.5px] px-3 py-3.5 text-[13px] font-medium transition-colors sm:px-[18px]",
              tab === "cost"
                ? "border-evvnt-vivid text-evvnt-core"
                : "border-transparent text-evvnt-n400 hover:text-evvnt-ink",
            )}
          >
            <Calendar className="size-3.5" strokeWidth={1.2} />
            Cost calculator
          </button>
          <div
            className="flex shrink-0 cursor-default items-center gap-1.5 whitespace-nowrap border-b-[2.5px] border-transparent px-3 py-3.5 text-[13px] font-medium text-evvnt-n300 sm:px-[18px]"
            aria-disabled
          >
            Run-of-show
            <span className="rounded px-1.5 py-px text-[9px] font-medium tracking-wide text-evvnt-n400 uppercase bg-evvnt-n100">
              Coming soon
            </span>
          </div>
        </div>

        {tab === "hall" && (
          <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] lg:grid-rows-1 lg:gap-0 lg:overflow-hidden">
            <div className="min-w-0 overflow-x-hidden border-evvnt-n200 bg-white lg:min-h-0 lg:overflow-y-auto lg:border-r">
              <VenueSection
                hallL={hallL}
                hallW={hallW}
                guests={guests}
                onHallL={setHallL}
                onHallW={setHallW}
                onGuests={setGuests}
              />
              <TableShapeSection
                shape={shape}
                seatsPerTable={seatsPerTable}
                tableDim1={tableDim1}
                tableDim2={tableDim2}
                tableHint={tableHint}
                onSelectShape={selectShape}
                onStepSeats={stepSeats}
                onSetSeats={setSeatsPerTable}
                onTableDim1={setTableDim1}
                onTableDim2={setTableDim2}
              />
              <DeductionsSection
                stageA={stageA}
                aisles={aisles}
                headTable={headTable}
                barBuffet={barBuffet}
                danceFloor={danceFloor}
                onStageA={setStageA}
                onAisles={setAisles}
                onHeadTable={setHeadTable}
                onBarBuffet={setBarBuffet}
                onDanceFloor={setDanceFloor}
              />
              <SpacingStandardsSection />
            </div>

            <div className="flex min-h-0 min-w-0 flex-col gap-3.5 p-4 sm:p-5 lg:overflow-y-auto">
              <section className="overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-2 border-evvnt-n100 border-b px-[18px] pt-3.5 pb-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[13px] font-semibold text-evvnt-ink">Capacity results</h2>
                    <p className="mt-0.5 text-[11px] text-evvnt-n400">
                      Updates as you adjust inputs on the left
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      overall.status === "ok" && "bg-evvnt-success-subtle text-evvnt-success",
                      overall.status === "warn" && "bg-evvnt-warn-subtle text-evvnt-warn",
                      overall.status === "bad" && "bg-evvnt-danger-subtle text-evvnt-danger",
                    )}
                  >
                    {overall.label}
                  </span>
                </div>
                <div className="px-[18px] py-4">
                  <div className="mb-3.5 grid grid-cols-2 gap-2.5 min-[480px]:grid-cols-4">
                    <Kpi
                      label="Total area"
                      value={`${Math.round(hall.totalArea)} m²`}
                      sub="Hall footprint"
                    />
                    <Kpi
                      label="Usable area"
                      value={`${Math.round(hall.usableArea)} m²`}
                      sub={`${Math.round((hall.usableArea / hall.totalArea) * 100)}% of total`}
                      valueClass="text-evvnt-core"
                    />
                    <Kpi
                      label="Tables that fit"
                      value={String(hall.tableFit)}
                      sub={`× ${seatsPerTable} seats`}
                    />
                    <Kpi
                      label="Max seats"
                      value={String(hall.maxSeats)}
                      sub={`need ${guests}`}
                      valueClass={hall.fits ? "text-evvnt-success" : "text-evvnt-danger"}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2 rounded-evvnt-lg bg-evvnt-n50 px-3 py-2.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-evvnt-ink">Space per guest</div>
                      <div
                        className={cn(
                          "mt-0.5 text-[11px] break-words text-evvnt-n400",
                          spaceLbl.rating === "comfortable" && "text-evvnt-success",
                          spaceLbl.rating === "tight" && "text-evvnt-danger",
                          spaceLbl.rating === "adequate" && "text-evvnt-warn",
                        )}
                      >
                        {spaceLbl.label}
                      </div>
                    </div>
                    <div className="shrink-0 text-left min-[420px]:text-right">
                      <div className="text-[22px] font-bold text-evvnt-ink tabular-nums">
                        {hall.spacePerGuest.toFixed(2)} m²
                      </div>
                      <div className="text-[10px] text-evvnt-n400">per person</div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex min-w-0 flex-col gap-2">
                {alerts.map((a) => (
                  <AlertBanner key={a.id} type={a.type}>
                    {a.node}
                  </AlertBanner>
                ))}
              </div>

              <section className="overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-2 border-evvnt-n100 border-b px-[18px] pt-3.5 pb-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[13px] font-semibold text-evvnt-ink">
                      Floor plan schematic
                    </h2>
                    <p className="mt-0.5 text-[11px] text-evvnt-n400">
                      Top-down view — proportional representation
                    </p>
                  </div>
                  <span className="shrink-0 rounded-evvnt-md border border-evvnt-n200 bg-evvnt-n50 px-2.5 py-1 text-[11px] text-evvnt-n400">
                    Scale ~1:30
                  </span>
                </div>
                <div className="px-3 pt-3 pb-3">
                  <div className="max-w-full overflow-hidden rounded-evvnt-xl border border-evvnt-n200 bg-evvnt-n50">
                    <FloorPlanCanvas
                      shape={shape}
                      hallL={hallL}
                      hallW={hallW}
                      tableFit={hall.tableFit}
                      seatsPerTable={seatsPerTable}
                      aisleCount={aisles}
                      hasStageBlock={stageA > 0 || headTable}
                      hasBar={barBuffet}
                      hasDance={danceFloor}
                      fits={hall.fits}
                      guests={guests}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3.5 border-evvnt-n100 border-t bg-white px-3.5 py-2.5">
                    <LegendDot label="Full table" className="bg-white ring-1 ring-evvnt-muted" />
                    <LegendDot
                      label="Partial (last row)"
                      className="bg-evvnt-warn-subtle ring-1 ring-evvnt-warn"
                    />
                    <LegendDot label="Stage" className="h-1.5 w-2.5 rounded-sm bg-evvnt-deep" />
                    <LegendDot
                      label="Aisle"
                      className="border border-dashed border-evvnt-muted bg-[rgb(124_58_237_/_12%)]"
                    />
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white">
                <div className="border-evvnt-n100 border-b px-[18px] py-3">
                  <h2 className="text-[13px] font-semibold text-evvnt-ink">Area breakdown</h2>
                </div>
                <div className="flex flex-col gap-1.5 px-[18px] py-4">
                  {areaRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex min-w-0 items-center justify-between gap-3 border-evvnt-n50 border-b py-1.5 last:border-0"
                    >
                      <span className="min-w-0 break-words text-xs text-evvnt-n700">
                        {row.label}
                      </span>
                      <span
                        className="shrink-0 text-right text-[13px] font-semibold tabular-nums"
                        style={{ color: row.col }}
                      >
                        {row.val > 0 ? "+" : ""}
                        {Math.round(row.val)} m²
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === "cost" && (
          <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] lg:grid-rows-1 lg:gap-0 lg:overflow-hidden">
            <div className="min-w-0 overflow-x-hidden border-evvnt-n200 bg-white lg:min-h-0 lg:overflow-y-auto lg:border-r">
              <div className="border-evvnt-n100 border-b px-5 py-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-evvnt-md bg-evvnt-tint">
                    <span className="text-evvnt-core">◎</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-evvnt-ink">Event parameters</div>
                    <div className="text-[11px] text-evvnt-n400">
                      These drive all category totals
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
                  <Field
                    label="Guest count"
                    hint="Synced from hall calculator"
                    input={<NumberInput value={guests} onChange={setGuests} min={1} suffix="pax" />}
                  />
                  <Field
                    label="Contingency buffer"
                    hint="Added on top of total estimate"
                    input={
                      <NumberInput
                        value={costBuffer}
                        onChange={setCostBuffer}
                        min={0}
                        max={50}
                        suffix="%"
                      />
                    }
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-5 py-5">
                {COST_CATS.map((cat) => (
                  <CostCategoryBlock
                    key={cat}
                    cat={cat}
                    open={openCats[cat]}
                    lines={linesByCat[cat]}
                    total={totals[cat]}
                    guests={guests}
                    onToggle={() => toggleCat(cat)}
                    onUpdateLine={(id, p) => updateLine(cat, id, p)}
                    onAdd={() =>
                      addLine(
                        cat,
                        cat === "food"
                          ? "New catering item"
                          : cat === "drinks"
                            ? "New drinks item"
                            : cat === "souv"
                              ? "New souvenir item"
                              : "New logistics item",
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-col gap-3.5 p-4 sm:p-5 lg:overflow-y-auto">
              <div
                className="relative flex flex-col gap-4 overflow-hidden rounded-evvnt-card px-4 py-4 min-[480px]:px-5 min-[480px]:py-[18px] sm:flex-row sm:items-center"
                style={{
                  backgroundImage: "linear-gradient(135deg, #2d0f6b 0%, #4b1fa8 60%, #7c3aed 100%)",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-5 -bottom-8 size-[130px] rounded-full bg-white/6"
                />
                <div className="relative z-10 min-w-0 flex-1">
                  <div className="mb-1 text-[9px] font-semibold tracking-wide text-white/40 uppercase">
                    Total estimated cost
                  </div>
                  <div className="text-[30px] font-bold text-white leading-none">
                    {fmtFull(Math.round(grand))}
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {fmtFull(Math.round(perHead))} per guest · {guests} guests · incl. {costBuffer}%
                    contingency
                  </div>
                </div>
                <div className="relative z-10 flex shrink-0 flex-col gap-1.75">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-evvnt-md bg-white px-4 py-2 text-xs font-semibold text-evvnt-core transition-colors hover:bg-evvnt-tint"
                  >
                    <Download className="size-3.25" strokeWidth={1.3} />
                    Export estimate
                  </button>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-evvnt-md border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25"
                  >
                    Push to budget
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white">
                <div className="flex items-center gap-2.5 border-evvnt-n100 border-b px-[18px] py-3">
                  <div className="flex size-[30px] items-center justify-center rounded-evvnt-md bg-evvnt-tint">
                    <LayoutGrid className="size-3.5 text-evvnt-core" strokeWidth={1.2} />
                  </div>
                  <div className="min-w-0 flex-1 text-[13px] font-semibold text-evvnt-ink">
                    Category breakdown
                  </div>
                  <div className="text-[15px] font-bold text-evvnt-core">
                    {fmtFull(Math.round(base))} base
                  </div>
                </div>
                <div className="px-[18px] py-3">
                  {COST_CATS.map((cat) => {
                    const t = totals[cat];
                    const pct = base > 0 ? (t / base) * 100 : 0;
                    const ph = guests > 0 ? t / guests : 0;
                    return (
                      <div
                        key={cat}
                        className="flex items-start justify-between gap-3 border-evvnt-n50 border-b py-2 last:border-0"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-evvnt-n700">{COST_CAT_LABELS[cat]}</div>
                          <div className="mt-1.25 h-0.75 overflow-hidden rounded-sm bg-evvnt-n100">
                            <div
                              className="h-full rounded-sm transition-all duration-300"
                              style={{
                                width: `${pct.toFixed(1)}%`,
                                background: COST_CAT_COLORS[cat],
                              }}
                            />
                          </div>
                          <div className="mt-1.25 text-[11px] text-evvnt-n400">
                            {fmtFull(Math.round(ph))} per head · {pct.toFixed(0)}% of total
                          </div>
                        </div>
                        <div className="text-[13px] font-semibold text-evvnt-ink">{fmtFull(t)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <section className="overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white">
                <div className="border-evvnt-n100 border-b px-[18px] py-3">
                  <h2 className="text-[13px] font-semibold text-evvnt-ink">
                    Per-guest cost snapshot
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2.5 px-[18px] py-4">
                  {COST_CATS.map((cat) => {
                    const t = totals[cat];
                    const ph = guests > 0 ? t / guests : 0;
                    return (
                      <div key={cat} className="rounded-evvnt-lg bg-evvnt-n50 p-3">
                        <div className="mb-1 text-[10px] font-semibold tracking-wide text-evvnt-n400 uppercase">
                          {COST_CAT_LABELS[cat]}
                        </div>
                        <div
                          className="text-[17px] font-bold"
                          style={{ color: COST_CAT_COLORS[cat] }}
                        >
                          {fmtFull(Math.round(ph))}
                        </div>
                        <div className="mt-0.5 text-[10px] text-evvnt-n400">per guest</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="rounded-evvnt-xl border border-evvnt-n200 bg-white px-4 py-3.5">
                <div className="mb-2 text-[11px] font-semibold tracking-wide text-evvnt-n400 uppercase">
                  Lagos market benchmarks
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-evvnt-n500">Budget wedding (per head)</span>
                    <span className="font-semibold text-evvnt-ink">₦15,000 – ₦25,000</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-evvnt-n500">Mid-range event (per head)</span>
                    <span className="font-semibold text-evvnt-ink">₦25,000 – ₦50,000</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-evvnt-n500">Premium event (per head)</span>
                    <span className="font-semibold text-evvnt-ink">₦50,000 – ₦120,000</span>
                  </div>
                  <div className="mt-1 flex justify-between gap-2 border-evvnt-n100 border-t pt-2">
                    <span className="text-evvnt-n500">Your estimate (per head)</span>
                    <span className="font-bold text-evvnt-core">
                      {fmtFull(Math.round(perHead))} · {tier}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LegendDot({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-evvnt-n500">
      <span className={cn("size-2.5 shrink-0 rounded-full", className)} />
      {label}
    </div>
  );
}

function AlertBanner({
  type,
  children,
}: {
  type: "bad" | "warn" | "ok";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-w-0 break-words rounded-evvnt-lg px-3.5 py-2.5 text-xs leading-snug text-evvnt-ink [&_strong]:font-semibold",
        type === "bad" && "border border-evvnt-danger-light bg-evvnt-danger-subtle",
        type === "warn" && "border border-evvnt-warn-light bg-evvnt-warn-subtle",
        type === "ok" && "border border-evvnt-success-light bg-evvnt-success-subtle",
      )}
    >
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
}) {
  return (
    <div className="min-w-0 rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist p-3">
      <div className="mb-1.25 text-[10px] font-semibold tracking-wide text-evvnt-n400 uppercase">
        {label}
      </div>
      <div className={cn("text-xl font-bold text-evvnt-ink leading-none", valueClass)}>{value}</div>
      <div className="mt-0.75 text-[10px] text-evvnt-n400">{sub}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  input,
}: {
  label: string;
  hint?: string;
  input: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
        {label}
      </div>
      {input}
      {hint ? <div className="text-[11px] text-evvnt-n400">{hint}</div> : null}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  suffix,
  step,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  suffix: string;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full rounded-evvnt-md border border-evvnt-n200 bg-white py-2 pr-9 pl-3 text-[13px] text-evvnt-ink outline-none transition-[border,box-shadow] focus:border-evvnt-vivid focus:shadow-[0_0_0_3px_rgb(124_58_237_/_10%)]",
          disabled && "cursor-not-allowed opacity-40",
        )}
      />
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-medium text-evvnt-n400">
        {suffix}
      </span>
    </div>
  );
}

function VenueSection({
  hallL,
  hallW,
  guests,
  onHallL,
  onHallW,
  onGuests,
}: {
  hallL: number;
  hallW: number;
  guests: number;
  onHallL: (n: number) => void;
  onHallW: (n: number) => void;
  onGuests: (n: number) => void;
}) {
  return (
    <section className="border-evvnt-n100 border-b px-5 py-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-evvnt-md bg-evvnt-tint">
          <LayoutGrid className="size-4 text-evvnt-core" strokeWidth={1.3} />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-evvnt-ink">Venue dimensions</div>
          <div className="text-[11px] text-evvnt-n400">Interior wall-to-wall measurements</div>
        </div>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        <Field
          label="Length"
          input={<NumberInput value={hallL} onChange={onHallL} min={5} max={300} suffix="m" />}
        />
        <Field
          label="Width"
          input={<NumberInput value={hallW} onChange={onHallW} min={5} max={300} suffix="m" />}
        />
      </div>
      <Field
        label="Expected guests"
        hint="Total seated guests including +1s and VIP"
        input={<NumberInput value={guests} onChange={onGuests} min={10} max={5000} suffix="pax" />}
      />
    </section>
  );
}

function TableShapeSection({
  shape,
  seatsPerTable,
  tableDim1,
  tableDim2,
  tableHint,
  onSelectShape,
  onStepSeats,
  onSetSeats,
  onTableDim1,
  onTableDim2,
}: {
  shape: HallInputs["shape"];
  seatsPerTable: number;
  tableDim1: number;
  tableDim2: number;
  tableHint: string;
  onSelectShape: (s: HallInputs["shape"]) => void;
  onStepSeats: (d: number) => void;
  onSetSeats: (n: number) => void;
  onTableDim1: (n: number) => void;
  onTableDim2: (n: number) => void;
}) {
  return (
    <section className="border-evvnt-n100 border-b px-5 py-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-evvnt-md bg-evvnt-success-subtle">
          <span className="text-evvnt-success">◉</span>
        </div>
        <div>
          <div className="text-[13px] font-semibold text-evvnt-ink">Table shape & size</div>
          <div className="text-[11px] text-evvnt-n400">
            Choose the table layout your venue will use
          </div>
        </div>
      </div>

      <div className="mb-3.5 flex flex-col gap-1">
        <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
          Table shape
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectShape("round")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-evvnt-lg border p-2.5 text-center transition-colors",
              shape === "round"
                ? "border-evvnt-vivid bg-evvnt-tint"
                : "border-evvnt-n200 hover:border-evvnt-muted hover:bg-evvnt-tint",
            )}
          >
            <span className="text-[11px] font-semibold text-evvnt-ink">Round</span>
            <span className="text-[10px] text-evvnt-n400">Standard Nigerian banquet</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectShape("rect")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-evvnt-lg border p-2.5 text-center transition-colors",
              shape === "rect"
                ? "border-evvnt-vivid bg-evvnt-tint"
                : "border-evvnt-n200 hover:border-evvnt-muted hover:bg-evvnt-tint",
            )}
          >
            <span className="text-[11px] font-semibold text-evvnt-ink">Rectangular</span>
            <span className="text-[10px] text-evvnt-n400">Corporate & conference</span>
          </button>
        </div>
      </div>

      <div className="mb-3.5 flex flex-col gap-1">
        <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
          Seats per table
        </div>
        <div className="flex h-[38px] overflow-hidden rounded-evvnt-md border border-evvnt-n200">
          <button
            type="button"
            onClick={() => onStepSeats(-1)}
            className="w-[38px] shrink-0 bg-evvnt-n50 text-lg text-evvnt-n500 transition-colors hover:bg-evvnt-tint hover:text-evvnt-core"
          >
            −
          </button>
          <input
            type="number"
            className="min-w-0 flex-1 border-0 bg-transparent text-center text-sm font-semibold text-evvnt-ink outline-none"
            value={seatsPerTable}
            min={4}
            max={14}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) {
                onSetSeats(Math.min(14, Math.max(4, v)));
              }
            }}
          />
          <button
            type="button"
            onClick={() => onStepSeats(1)}
            className="w-[38px] shrink-0 bg-evvnt-n50 text-lg text-evvnt-n500 transition-colors hover:bg-evvnt-tint hover:text-evvnt-core"
          >
            +
          </button>
        </div>
        <div className="text-[11px] text-evvnt-n400">{tableHint}</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Field
          label={shape === "round" ? "Table diameter" : "Table width"}
          input={
            <NumberInput
              value={tableDim1}
              onChange={onTableDim1}
              min={shape === "round" ? 0.8 : 1}
              max={shape === "round" ? 4 : 6}
              step={0.1}
              suffix="m"
            />
          }
        />
        <Field
          label="Table length"
          input={
            <NumberInput
              value={tableDim2}
              onChange={onTableDim2}
              min={1}
              max={6}
              step={0.1}
              suffix="m"
              disabled={shape === "round"}
            />
          }
        />
      </div>
    </section>
  );
}

function DeductionsSection({
  stageA,
  aisles,
  headTable,
  barBuffet,
  danceFloor,
  onStageA,
  onAisles,
  onHeadTable,
  onBarBuffet,
  onDanceFloor,
}: {
  stageA: number;
  aisles: number;
  headTable: boolean;
  barBuffet: boolean;
  danceFloor: boolean;
  onStageA: (n: number) => void;
  onAisles: (n: number) => void;
  onHeadTable: (v: boolean) => void;
  onBarBuffet: (v: boolean) => void;
  onDanceFloor: (v: boolean) => void;
}) {
  return (
    <section className="border-evvnt-n100 border-b px-5 py-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-evvnt-md bg-evvnt-warn-subtle">
          <span className="text-evvnt-warn">⚠</span>
        </div>
        <div>
          <div className="text-[13px] font-semibold text-evvnt-ink">Space deductions</div>
          <div className="text-[11px] text-evvnt-n400">Areas that reduce seating footprint</div>
        </div>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        <Field
          label="Stage / altar / podium"
          input={<NumberInput value={stageA} onChange={onStageA} min={0} max={500} suffix="m²" />}
        />
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
            Number of aisles
          </div>
          <select
            value={aisles}
            onChange={(e) => onAisles(Number(e.target.value))}
            className="w-full appearance-none rounded-evvnt-md border border-evvnt-n200 bg-white py-2 pr-10 pl-3 text-[13px] text-evvnt-ink outline-none focus:border-evvnt-vivid focus:shadow-[0_0_0_3px_rgb(124_58_237_/_10%)]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%237C3AED' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 11px center",
            }}
          >
            <option value={1}>1 aisle (small hall)</option>
            <option value={2}>2 aisles (standard)</option>
            <option value={3}>3 aisles (large)</option>
            <option value={4}>4 aisles (very large)</option>
          </select>
        </div>
      </div>
      <ToggleRow
        title="Head / high table area"
        sub="Reserves ~20m² for the top-table setup"
        checked={headTable}
        onChange={onHeadTable}
      />
      <ToggleRow
        title="Bar / buffet zone"
        sub="Reserves ~15m² for bar or food stations"
        checked={barBuffet}
        onChange={onBarBuffet}
      />
      <ToggleRow
        title="Dance floor"
        sub="Reserves ~25m² — common for Nigerian events"
        checked={danceFloor}
        onChange={onDanceFloor}
      />
    </section>
  );
}

function ToggleRow({
  title,
  sub,
  checked,
  onChange,
}: {
  title: string;
  sub: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-2">
      <div>
        <div className="text-[13px] text-evvnt-ink">{title}</div>
        <div className="mt-0.5 text-[11px] text-evvnt-n400">{sub}</div>
      </div>
      <div className="relative h-[21px] w-[38px] shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="pointer-events-none absolute inset-0 rounded-[11px] bg-evvnt-n300 transition-colors peer-checked:bg-evvnt-vivid" />
        <span className="pointer-events-none absolute top-[3px] left-[3px] size-[15px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[17px]" />
      </div>
    </label>
  );
}

function SpacingStandardsSection() {
  return (
    <section className="px-5 py-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-evvnt-md bg-evvnt-danger-subtle">
          <span className="text-evvnt-danger">!</span>
        </div>
        <div>
          <div className="text-[13px] font-semibold text-evvnt-ink">Spacing standards applied</div>
          <div className="text-[11px] text-evvnt-n400">Industry minimums — cannot be reduced</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
        {[
          { v: "1.5 m", l: "Aisle width" },
          { v: "0.6 m", l: "Chair clearance" },
          { v: "1.0 m", l: "Table gap" },
        ].map((x) => (
          <div key={x.l} className="min-w-0 rounded-evvnt-md bg-evvnt-n50 py-2.5 text-center">
            <div className="text-[17px] font-bold text-evvnt-ink">{x.v}</div>
            <div className="mt-0.5 text-[10px] text-evvnt-n400">{x.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CostCategoryBlock({
  cat,
  open,
  lines,
  total,
  guests,
  onToggle,
  onUpdateLine,
  onAdd,
}: {
  cat: CostCategoryId;
  open: boolean;
  lines: CostLineItem[];
  total: number;
  guests: number;
  onToggle: () => void;
  onUpdateLine: (id: string, p: Partial<CostLineItem>) => void;
  onAdd: () => void;
}) {
  const perHead = guests > 0 ? total / guests : 0;
  return (
    <div className="overflow-hidden rounded-evvnt-xl border border-evvnt-n200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left"
      >
        <div
          className="flex size-[30px] shrink-0 items-center justify-center rounded-evvnt-md"
          style={{
            background:
              cat === "food"
                ? "var(--color-evvnt-success-subtle)"
                : cat === "drinks"
                  ? "var(--color-evvnt-tint)"
                  : cat === "souv"
                    ? "var(--color-evvnt-warn-subtle)"
                    : "var(--color-evvnt-danger-subtle)",
          }}
        >
          <span className="text-xs">●</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-evvnt-ink">{COST_CAT_LABELS[cat]}</div>
          <div className="text-[11px] text-evvnt-n400">{fmtFull(Math.round(perHead))} per head</div>
        </div>
        <div className="text-[14px] font-bold text-evvnt-core">{fmtShort(total)}</div>
        <svg
          className={cn(
            "size-3.5 shrink-0 text-evvnt-n300 transition-transform",
            open && "rotate-180",
          )}
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <title>Toggle</title>
          <path
            d="M3 5l4 4 4-4"
            stroke="#9CA3AF"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="border-evvnt-n100 border-t px-4 py-3">
          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1">
            <div className="min-w-[min(100%,360px)]">
              <div className="mb-1.5 grid grid-cols-[minmax(6rem,1fr)_5.5rem_4.5rem_4.5rem] gap-2 border-evvnt-n100 border-b pb-1.5 sm:grid-cols-[minmax(0,1fr)_110px_90px_90px]">
                <div className="text-[9px] font-semibold tracking-wide text-evvnt-n400 uppercase">
                  Item
                </div>
                <div className="text-[9px] font-semibold tracking-wide text-evvnt-n400 uppercase">
                  Unit cost (₦)
                </div>
                <div className="text-[9px] font-semibold tracking-wide text-evvnt-n400 uppercase">
                  Qty / guest
                </div>
                <div className="text-right text-[9px] font-semibold tracking-wide text-evvnt-n400 uppercase">
                  Subtotal
                </div>
              </div>
              {lines.map((line) => {
                const sub = line.unitCost * line.qtyPerGuest * guests;
                return (
                  <div
                    key={line.id}
                    className="mb-2.5 grid grid-cols-[minmax(6rem,1fr)_5.5rem_4.5rem_4.5rem] items-center gap-2 last:mb-0 sm:grid-cols-[minmax(0,1fr)_110px_90px_90px]"
                  >
                    <div className="min-w-0">
                      <input
                        value={line.name}
                        onChange={(e) => onUpdateLine(line.id, { name: e.target.value })}
                        className="w-full border-0 bg-transparent text-xs font-medium text-evvnt-n700 outline-none"
                      />
                      <div className="text-[10px] text-evvnt-n400">{line.description}</div>
                    </div>
                    <input
                      type="number"
                      className="rounded-evvnt-md border border-evvnt-n200 px-2.5 py-1.5 text-[13px] outline-none focus:border-evvnt-vivid"
                      value={line.unitCost}
                      onChange={(e) =>
                        onUpdateLine(line.id, { unitCost: Number(e.target.value) || 0 })
                      }
                    />
                    <input
                      type="number"
                      step={0.1}
                      className="rounded-evvnt-md border border-evvnt-n200 px-2.5 py-1.5 text-[13px] outline-none focus:border-evvnt-vivid"
                      value={line.qtyPerGuest}
                      onChange={(e) =>
                        onUpdateLine(line.id, { qtyPerGuest: Number(e.target.value) || 0 })
                      }
                    />
                    <div className="text-right text-[13px] font-semibold text-evvnt-ink">
                      {fmtFull(Math.round(sub))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="mt-2 flex cursor-pointer items-center gap-1.5 border-evvnt-n200 border-t border-dashed pt-2 text-evvnt-vivid"
          >
            <span className="text-lg leading-none">+</span>
            <span className="text-[11px] font-medium">Add line</span>
          </button>
        </div>
      )}
    </div>
  );
}
