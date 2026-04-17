import type { TableShape } from "@/lib/event-planner/hall-compute";
import { useEffect, useRef } from "react";

type FloorPlanCanvasProps = {
  shape: TableShape;
  hallL: number;
  hallW: number;
  tableFit: number;
  seatsPerTable: number;
  aisleCount: number;
  hasStageBlock: boolean;
  hasBar: boolean;
  hasDance: boolean;
  fits: boolean;
  guests: number;
};

/** Top-down schematic — logic ported from evvnt-planner-v2.html */
export function FloorPlanCanvas({
  shape,
  hallL,
  hallW,
  tableFit,
  seatsPerTable,
  aisleCount: _aisleCount,
  hasStageBlock,
  hasBar,
  hasDance: _hasDance,
  fits,
  guests: _guests,
}: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const draw = () => {
      const L = hallL;
      const W = hallW;
      const cw = container.clientWidth || 500;
      const aspect = W / L;
      const ch = Math.min(Math.max(cw * aspect, 140), 280);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cw, ch);

      const PAD = 10;
      const pw = cw - PAD * 2;
      const ph = ch - PAD * 2;
      const scaleX = pw / L;
      const scaleY = ph / W;
      const sc = Math.min(scaleX, scaleY);
      const ox = PAD + (pw - L * sc) / 2;
      const oy = PAD + (ph - W * sc) / 2;

      ctx.fillStyle = "#F9FAFB";
      ctx.strokeStyle = "#D1D5DB";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(ox, oy, L * sc, W * sc, 4);
      } else {
        ctx.rect(ox, oy, L * sc, W * sc);
      }
      ctx.fill();
      ctx.stroke();

      let cursorY = oy + 4;

      if (hasStageBlock) {
        const sh = 30;
        ctx.fillStyle = "#2D0F6B";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(ox + 4, cursorY, L * sc - 8, sh, 4);
        } else {
          ctx.rect(ox + 4, cursorY, L * sc - 8, sh);
        }
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.5)";
        ctx.font = "600 9px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("STAGE / HEAD TABLE", ox + (L * sc) / 2, cursorY + 18);
        cursorY += sh + 6;
      }

      const tableSize = shape === "round" ? 18 : 22;
      const tileSize = tableSize + 6;
      const perRow = Math.max(1, Math.floor((L * sc - 8) / tileSize));
      const VIZ_MAX = Math.min(tableFit, 80);

      for (let i = 0; i < VIZ_MAX; i++) {
        const col = i % perRow;
        const row = Math.floor(i / perRow);
        const tx = ox + 4 + col * tileSize + tileSize / 2;
        const ty = cursorY + row * tileSize + tileSize / 2;

        if (ty + tileSize / 2 > oy + W * sc - 4) {
          break;
        }

        const isPartial = i === VIZ_MAX - 1 && !fits;
        ctx.fillStyle = isPartial ? "#FFFBEB" : "#fff";
        ctx.strokeStyle = isPartial ? "#D97706" : "#C4B5FD";
        ctx.lineWidth = 1;

        if (shape === "round") {
          ctx.beginPath();
          ctx.arc(tx, ty, tableSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(
              tx - tableSize / 2,
              ty - (tableSize - 4) / 2,
              tableSize,
              tableSize - 4,
              2,
            );
          } else {
            ctx.rect(tx - tableSize / 2, ty - (tableSize - 4) / 2, tableSize, tableSize - 4);
          }
          ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = isPartial ? "#D97706" : "#4B1FA8";
        ctx.font = "600 7px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(seatsPerTable), tx, ty);
      }

      if (hasBar) {
        const bh = 16;
        ctx.fillStyle = "rgba(5,150,105,.12)";
        ctx.strokeStyle = "rgba(5,150,105,.3)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(ox + 4, oy + W * sc - bh - 4, L * sc - 8, bh, 3);
        } else {
          ctx.rect(ox + 4, oy + W * sc - bh - 4, L * sc - 8, bh);
        }
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#059669";
        ctx.font = "500 8px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("BAR / BUFFET", ox + (L * sc) / 2, oy + W * sc - bh / 2 - 4);
      }
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    window.addEventListener("resize", draw);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [shape, hallL, hallW, tableFit, seatsPerTable, hasStageBlock, hasBar, fits]);

  return (
    <div ref={containerRef} className="min-h-[200px] w-full min-w-0 max-w-full">
      <canvas ref={canvasRef} className="block h-auto max-w-full" />
    </div>
  );
}
