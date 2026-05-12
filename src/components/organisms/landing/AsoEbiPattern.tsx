import { cn } from "@utils";

type AsoEbiPatternProps = {
  className?: string;
  /** Stroke colour. Defaults to the brand vivid purple. */
  color?: string;
  /** Opacity multiplier 0..1. Default 0.12 for dark surfaces. */
  opacity?: number;
  /** Tile size in px (controls density). Default 56. */
  size?: number;
};

/**
 * Tiling SVG inspired by aso-ebi / adire geometric motifs:
 * interlocking diamonds + cardinal dots. Used as an ambient overlay on dark
 * surfaces (hero, CTA band) and as a section divider on light surfaces.
 */
export function AsoEbiPattern({
  className,
  color = "#a78bfa",
  opacity = 0.12,
  size = 56,
}: AsoEbiPatternProps) {
  const half = size / 2;
  const id = `aso-ebi-${size}`;

  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    >
      <title>Aso-ebi inspired pattern</title>
      <defs>
        <pattern id={id} x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${half} 2 L ${size - 2} ${half} L ${half} ${size - 2} L 2 ${half} Z`}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <path
            d={`M ${half} ${half - 8} L ${half + 8} ${half} L ${half} ${half + 8} L ${half - 8} ${half} Z`}
            fill={color}
            fillOpacity="0.35"
          />
          <circle cx={half} cy="2" r="1" fill={color} />
          <circle cx={size - 2} cy={half} r="1" fill={color} />
          <circle cx={half} cy={size - 2} r="1" fill={color} />
          <circle cx="2" cy={half} r="1" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
