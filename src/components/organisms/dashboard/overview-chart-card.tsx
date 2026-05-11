import { useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
import { cn } from "@utils";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export type OverviewTimeRange = "1d" | "7d" | "30d" | "6m" | "max";

export type OverviewChartPoint = {
  label: string;
  primary: number;
  secondary: number;
};

export type OverviewRangeConfig = {
  headline: string;
  subline: ReactNode;
  points: OverviewChartPoint[];
};

const RANGES: { id: OverviewTimeRange; label: string }[] = [
  { id: "1d", label: "1d" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "6m", label: "6m" },
  { id: "max", label: "Max" },
];

const VB_W = 560;
const VB_H = 132;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 26;

function buildPath(
  points: OverviewChartPoint[],
  key: "primary" | "secondary",
  minY: number,
  maxY: number,
): string {
  if (points.length === 0) return "";
  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;
  const span = Math.max(maxY - minY, 1);
  const n = points.length;
  return points
    .map((p, i) => {
      const x = PAD_L + innerW * (n === 1 ? 0.5 : i / (n - 1));
      const y = PAD_T + innerH * (1 - (p[key] - minY) / span);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

type OverviewChartCardProps = {
  title?: string;
  metricDropdownLabel?: string;
  data: Record<OverviewTimeRange, OverviewRangeConfig>;
  defaultRange?: OverviewTimeRange;
  primarySeriesLabel?: string;
  secondarySeriesLabel?: string;
  className?: string;
};

export function OverviewChartCard({
  title = "Workspace overview",
  metricDropdownLabel = "Ticket sales",
  data,
  defaultRange = "7d",
  primarySeriesLabel = "Tickets",
  secondarySeriesLabel = "Guests",
  className,
}: OverviewChartCardProps) {
  const [range, setRange] = useState<OverviewTimeRange>(defaultRange);
  const cfg = data[range];
  const points = cfg.points;

  const { pathA, pathB, dots } = useMemo(() => {
    const vals = points.flatMap((p) => [p.primary, p.secondary]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.12 || 4;
    const minY = min - pad;
    const maxY = max + pad;
    const innerW = VB_W - PAD_L - PAD_R;
    const innerH = VB_H - PAD_T - PAD_B;
    const span = Math.max(maxY - minY, 1);
    const n = points.length;
    const dots = points.map((p, i) => {
      const x = PAD_L + innerW * (n === 1 ? 0.5 : i / (n - 1));
      const yP = PAD_T + innerH * (1 - (p.primary - minY) / span);
      const yS = PAD_T + innerH * (1 - (p.secondary - minY) / span);
      return { x, yP, yS, p };
    });
    return {
      pathA: buildPath(points, "primary", minY, maxY),
      pathB: buildPath(points, "secondary", minY, maxY),
      dots,
    };
  }, [points]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[14px] border border-evvnt-n200/90 bg-white shadow-[0_4px_24px_-8px_rgb(26_9_51_/_10%)]",
        className,
      )}
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold tracking-tight text-evvnt-n500">{title}</h2>
            <div className="mt-1 text-2xl leading-none font-bold tracking-tight text-evvnt-ink sm:text-[26px]">
              {cfg.headline}
            </div>
            <div className="mt-1.5 text-xs leading-snug text-evvnt-n700">{cfg.subline}</div>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:shrink-0">
            <Tabs
              value={range}
              onValueChange={(v) => setRange(v as OverviewTimeRange)}
              className="w-full sm:w-auto"
            >
              <TabsList className="h-auto w-full justify-start gap-0.5 overflow-x-auto rounded-[10px] border border-evvnt-n200/80 bg-evvnt-n50 p-0.5 [scrollbar-width:none] sm:w-auto [&::-webkit-scrollbar]:hidden">
                {RANGES.map((r) => (
                  <TabsTrigger
                    key={r.id}
                    value={r.id}
                    className={cn(
                      "h-auto shrink-0 rounded-[8px] border border-transparent px-2.5 py-1.5 text-[11px] font-semibold shadow-none",
                      "data-[state=active]:border-evvnt-n300 data-[state=active]:bg-evvnt-ink data-[state=active]:text-white data-[state=active]:shadow-sm",
                      "data-[state=inactive]:text-evvnt-n500 data-[state=inactive]:hover:bg-white",
                    )}
                  >
                    {r.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 self-start rounded-[10px] border border-evvnt-n200 bg-white px-3 py-2 text-xs font-medium text-evvnt-ink shadow-[0_1px_2px_rgb(26_9_51_/_5%)] transition-colors hover:bg-evvnt-n50 focus-visible:ring-2 focus-visible:ring-evvnt-muted/60 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {metricDropdownLabel}
              <ChevronDown className="size-3.5 text-evvnt-n400" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[12px] bg-gradient-to-b from-evvnt-n50/80 to-white px-1 pt-2 pb-1">
          <svg
            className="h-[200px] w-full text-evvnt-n200"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Chart for ${primarySeriesLabel} and ${secondarySeriesLabel}`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = PAD_T + (VB_H - PAD_T - PAD_B) * t;
              return (
                <line
                  key={t}
                  x1={PAD_L}
                  y1={y}
                  x2={VB_W - PAD_R}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.45}
                  strokeWidth={1}
                  strokeDasharray="4 6"
                />
              );
            })}
            <path
              d={pathB}
              fill="none"
              stroke="var(--color-evvnt-core)"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={pathA}
              fill="none"
              stroke="var(--color-evvnt-warn)"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {dots.map((d, i) => (
              <g key={`${d.p.label}-${i}`}>
                <circle cx={d.x} cy={d.yP} r={5} fill="var(--color-evvnt-warn)">
                  <title>
                    {d.p.label}: {primarySeriesLabel} {d.p.primary}, {secondarySeriesLabel}{" "}
                    {d.p.secondary}
                  </title>
                </circle>
                <circle
                  cx={d.x}
                  cy={d.yS}
                  r={4}
                  fill="var(--color-evvnt-core)"
                  stroke="white"
                  strokeWidth={1.5}
                >
                  <title>
                    {d.p.label}: {primarySeriesLabel} {d.p.primary}, {secondarySeriesLabel}{" "}
                    {d.p.secondary}
                  </title>
                </circle>
              </g>
            ))}
          </svg>
          <div className="flex w-full justify-between gap-0.5 pt-1 text-[10px] font-medium tracking-tight text-evvnt-n400">
            {points.map((p) => (
              <span key={p.label} className="min-w-0 flex-1 truncate text-center">
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-evvnt-n100 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-evvnt-n500">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-evvnt-warn" aria-hidden />
              {primarySeriesLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-evvnt-core" aria-hidden />
              {secondarySeriesLabel}
            </span>
          </div>
          <p className="text-[10px] text-evvnt-n400">
            Demo trend index · connect analytics to replace
          </p>
        </div>
      </div>
    </section>
  );
}
