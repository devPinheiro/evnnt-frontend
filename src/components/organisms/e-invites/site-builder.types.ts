import type { TemplateEventType, TemplateSections } from "./invite-template-types";

export type SiteBuilderPageId = "home" | "schedule" | "travel" | "registry" | "rsvp" | "album" | "faq";
export type SiteBuilderBlockType =
  | "hero"
  | "story"
  | "countdown"
  | "schedule"
  | "travel"
  | "map"
  | "registry"
  | "rsvp"
  | "gallery"
  | "faq";

export type SiteBuilderBlock = {
  id: string;
  type: SiteBuilderBlockType;
  style: "soft" | "bold";
};

export type SiteBuilderDocument = Record<SiteBuilderPageId, SiteBuilderBlock[]>;

const pageIds: SiteBuilderPageId[] = [
  "home",
  "schedule",
  "travel",
  "registry",
  "rsvp",
  "album",
  "faq",
];

const blockTypes: readonly SiteBuilderBlockType[] = [
  "hero",
  "story",
  "countdown",
  "schedule",
  "travel",
  "map",
  "registry",
  "rsvp",
  "gallery",
  "faq",
];

function isSiteBuilderBlockType(value: unknown): value is SiteBuilderBlockType {
  return typeof value === "string" && (blockTypes as readonly string[]).includes(value);
}

function isSiteBuilderPageId(value: string): value is SiteBuilderPageId {
  return (pageIds as readonly string[]).includes(value);
}

export function cloneSiteBuilderDocument(source: SiteBuilderDocument): SiteBuilderDocument {
  return {
    home: [...source.home],
    schedule: [...source.schedule],
    travel: [...source.travel],
    registry: [...source.registry],
    rsvp: [...source.rsvp],
    album: [...source.album],
    faq: [...source.faq],
  };
}

export function sectionsFromDocument(blocksByPage: SiteBuilderDocument): TemplateSections {
  const homeTypes = new Set(blocksByPage.home.map((item) => item.type));
  const travelTypes = new Set(blocksByPage.travel.map((item) => item.type));
  return {
    hero: homeTypes.has("hero"),
    story: homeTypes.has("story"),
    schedule: blocksByPage.schedule.length > 0,
    travel: blocksByPage.travel.length > 0,
    registry: blocksByPage.registry.length > 0,
    gallery: blocksByPage.album.length > 0,
    rsvp: blocksByPage.rsvp.length > 0,
    faq: blocksByPage.faq.length > 0,
    map: travelTypes.has("map") || blocksByPage.schedule.some((item) => item.type === "map"),
  };
}

/**
 * Build the default page/block graph from boolean section flags (used when no saved document exists).
 */
export function createDefaultSiteBuilderDocument(
  sections: TemplateSections,
  eventType: TemplateEventType,
): SiteBuilderDocument {
  let n = 0;
  const next = () => {
    n += 1;
    return `b-${n}`;
  };
  const home: SiteBuilderBlock[] = [];
  if (sections.hero) home.push({ id: next(), type: "hero", style: "bold" });
  if (sections.story) home.push({ id: next(), type: "story", style: "soft" });
  if (eventType === "wedding") home.push({ id: next(), type: "countdown", style: "soft" });

  const schedule: SiteBuilderBlock[] = sections.schedule
    ? [{ id: next(), type: "schedule", style: "soft" }]
    : [];
  if (sections.map) schedule.push({ id: next(), type: "map", style: "soft" });

  return {
    home,
    schedule,
    travel: sections.travel ? [{ id: next(), type: "travel", style: "soft" }] : [],
    registry: sections.registry ? [{ id: next(), type: "registry", style: "soft" }] : [],
    rsvp: sections.rsvp ? [{ id: next(), type: "rsvp", style: "bold" }] : [],
    album: sections.gallery ? [{ id: next(), type: "gallery", style: "soft" }] : [],
    faq: sections.faq ? [{ id: next(), type: "faq", style: "soft" }] : [],
  };
}

function parseBlockList(raw: unknown): SiteBuilderBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: SiteBuilderBlock[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item == null) continue;
    const o = item as Record<string, unknown>;
    if (typeof o.id !== "string" || o.id.length === 0) continue;
    if (!isSiteBuilderBlockType(o.type)) continue;
    const style = o.style === "bold" || o.style === "soft" ? o.style : "soft";
    out.push({ id: o.id, type: o.type, style });
  }
  return out;
}

/**
 * Best-effort parse of API / sessionStorage JSON into a full document. Invalid pages fall back to [].
 */
const emptyPageDoc = (): SiteBuilderDocument => ({
  home: [],
  schedule: [],
  travel: [],
  registry: [],
  rsvp: [],
  album: [],
  faq: [],
});

export function parseSiteBuilderDocument(value: unknown): SiteBuilderDocument | null {
  if (typeof value !== "object" || value == null) return null;
  const o = value as Record<string, unknown>;
  const base = emptyPageDoc();
  for (const page of pageIds) {
    if (page in o) base[page] = parseBlockList(o[page]);
  }
  return base;
}
