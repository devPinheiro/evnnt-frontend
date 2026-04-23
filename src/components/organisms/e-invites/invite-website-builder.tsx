import { GripVertical, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InviteGuestSitePreview } from "./invite-guest-site-preview";
import type { InviteGuestSiteModel, TemplateEventType, TemplateSections } from "./invite-template-types";
import {
  cloneSiteBuilderDocument,
  type SiteBuilderBlock,
  type SiteBuilderBlockType,
  type SiteBuilderDocument,
  type SiteBuilderPageId,
  sectionsFromDocument,
} from "./site-builder.types";

type InviteWebsiteBuilderProps = Omit<InviteGuestSiteModel, "sections"> & {
  document: SiteBuilderDocument;
  onDocumentChange: (next: SiteBuilderDocument) => void;
  onSectionsChange?: (next: TemplateSections) => void;
};

const pageOrder: SiteBuilderPageId[] = [
  "home",
  "schedule",
  "travel",
  "registry",
  "rsvp",
  "album",
  "faq",
];
const pageLabel: Record<SiteBuilderPageId, string> = {
  home: "Home",
  schedule: "Schedule",
  travel: "Travel",
  registry: "Registry",
  rsvp: "RSVP",
  album: "Album",
  faq: "FAQ",
};

const palette: Array<{ type: SiteBuilderBlockType; label: string; pages: SiteBuilderPageId[] }> = [
  { type: "hero", label: "Hero banner", pages: ["home"] },
  { type: "story", label: "Story section", pages: ["home"] },
  { type: "countdown", label: "Countdown timer", pages: ["home"] },
  { type: "schedule", label: "Event timeline", pages: ["schedule"] },
  { type: "travel", label: "Travel cards", pages: ["travel"] },
  { type: "map", label: "Map directions", pages: ["travel", "schedule"] },
  { type: "registry", label: "Registry cards", pages: ["registry"] },
  { type: "rsvp", label: "RSVP form", pages: ["rsvp"] },
  { type: "gallery", label: "Media gallery", pages: ["album"] },
  { type: "faq", label: "FAQ accordion", pages: ["faq"] },
];

type DragState =
  | { kind: "palette"; type: SiteBuilderBlockType }
  | { kind: "block"; page: SiteBuilderPageId; index: number }
  | null;

export function InviteWebsiteBuilder({
  document: blocksByPage,
  onDocumentChange,
  eventType,
  title,
  subject,
  message,
  eventDate,
  venue,
  dressCode,
  rsvpFlow,
  guestExperience,
  heroImageUrl,
  heroVideoUrl,
  galleryImageUrls,
  galleryVideoUrls,
  onSectionsChange,
}: InviteWebsiteBuilderProps) {
  const idCounter = useRef(0);
  const nextId = () => `block-${++idCounter.current}`;

  const [activePage, setActivePage] = useState<SiteBuilderPageId>("home");
  const [dragState, setDragState] = useState<DragState>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const setBlocks = (updater: (prev: SiteBuilderDocument) => SiteBuilderDocument) => {
    onDocumentChange(updater(cloneSiteBuilderDocument(blocksByPage)));
  };

  const pageBlocks = blocksByPage[activePage];
  const selectedBlock = useMemo(
    () => pageBlocks.find((item) => item.id === selectedBlockId) ?? null,
    [pageBlocks, selectedBlockId],
  );

  useEffect(() => {
    onSectionsChange?.(sectionsFromDocument(blocksByPage));
  }, [blocksByPage, onSectionsChange]);

  function createBlock(type: SiteBuilderBlockType): SiteBuilderBlock {
    return { id: nextId(), type, style: type === "hero" || type === "rsvp" ? "bold" : "soft" };
  }

  function applyDrop(targetPage: SiteBuilderPageId, targetIndex?: number) {
    if (!dragState) return;
    setBlocks((prev) => {
      const next = cloneSiteBuilderDocument(prev);
      const destination = next[targetPage];

      if (dragState.kind === "palette") {
        const insertAt = Math.max(0, Math.min(destination.length, targetIndex ?? destination.length));
        destination.splice(insertAt, 0, createBlock(dragState.type));
        return next;
      }

      const source = next[dragState.page];
      const [moved] = source.splice(dragState.index, 1);
      if (!moved) return prev;
      const insertAt = Math.max(0, Math.min(destination.length, targetIndex ?? destination.length));
      destination.splice(insertAt, 0, moved);
      return next;
    });
    setDragState(null);
  }

  function removeBlock(page: SiteBuilderPageId, id: string) {
    setBlocks((base) => ({
      ...base,
      [page]: base[page].filter((item) => item.id !== id),
    }));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  function updateBlockStyle(page: SiteBuilderPageId, id: string, style: SiteBuilderBlock["style"]) {
    setBlocks((base) => ({
      ...base,
      [page]: base[page].map((item) => (item.id === id ? { ...item, style } : item)),
    }));
  }

  function renderCanvasBlock(block: SiteBuilderBlock) {
    const baseClass =
      block.style === "bold"
        ? "rounded-evvnt-md border border-evvnt-muted bg-evvnt-tint p-3"
        : "rounded-evvnt-md border border-evvnt-n200 bg-white p-3";
    if (block.type === "hero") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Hero</p>
          <p className="mt-1 text-[13px] font-semibold text-evvnt-ink">{subject || title}</p>
          <p className="text-[11px] text-evvnt-n600">
            {eventDate || "Event date pending"} · {venue || "Venue pending"}
          </p>
        </div>
      );
    }
    if (block.type === "story") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Story</p>
          <p className="mt-1 text-[11px] text-evvnt-n600">{message}</p>
        </div>
      );
    }
    if (block.type === "countdown") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Countdown</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">Countdown timer until {eventDate || "event day"}.</p>
        </div>
      );
    }
    if (block.type === "schedule") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Schedule</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">Ceremony, reception, and timeline modules.</p>
        </div>
      );
    }
    if (block.type === "travel") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Travel</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">Hotels, shuttles, parking, and transport details.</p>
        </div>
      );
    }
    if (block.type === "registry") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Registry</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">Registry links and contribution funds.</p>
        </div>
      );
    }
    if (block.type === "map") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Map</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">Embedded location card for {venue || "venue"}.</p>
        </div>
      );
    }
    if (block.type === "rsvp") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">RSVP</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">Smart RSVP form ({rsvpFlow}) with custom questions.</p>
        </div>
      );
    }
    if (block.type === "gallery") {
      return (
        <div className={baseClass}>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Gallery</p>
          <p className="mt-1 text-[12px] text-evvnt-n700">
            {galleryImageUrls.length} images · {galleryVideoUrls.length} videos.
          </p>
        </div>
      );
    }
    return (
      <div className={baseClass}>
        <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">FAQ</p>
        <p className="mt-1 text-[12px] text-evvnt-n700">Accordion with guest common questions and answers.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
      <aside className="space-y-3 rounded-evvnt-lg border border-evvnt-n200 bg-white p-3">
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Pages</p>
          <div className="mt-2 space-y-1.5">
            {pageOrder.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={
                  page === activePage
                    ? "flex w-full items-center justify-between rounded-evvnt-sm border border-evvnt-muted bg-evvnt-tint px-2.5 py-1.5 text-[11px] font-semibold text-evvnt-core"
                    : "flex w-full items-center justify-between rounded-evvnt-sm border border-evvnt-n200 px-2.5 py-1.5 text-[11px] text-evvnt-n600 hover:border-evvnt-n300"
                }
              >
                <span>{pageLabel[page]}</span>
                <span className="text-[10px] opacity-70">{blocksByPage[page].length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="border-evvnt-n100 border-t pt-3">
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Block palette</p>
          <div className="mt-2 space-y-1.5">
            {palette
              .filter((item) => item.pages.includes(activePage))
              .map((item) => (
                <button
                  key={item.type}
                  type="button"
                  draggable
                  onDragStart={() => setDragState({ kind: "palette", type: item.type })}
                  className="flex w-full items-center gap-1.5 rounded-evvnt-sm border border-evvnt-n200 px-2 py-1.5 text-left text-[11px] text-evvnt-n600 hover:border-evvnt-n300"
                >
                  <Plus className="size-3" />
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      </aside>

      <section className="space-y-3 rounded-evvnt-lg border border-evvnt-n200 bg-white p-3">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Canvas · {pageLabel[activePage]}
            </p>
            <p className="text-[11px] text-evvnt-n500">Drag blocks from palette or reorder existing blocks.</p>
          </div>
          <LayoutGrid className="size-4 text-evvnt-n400" />
        </header>
        <div
          className="min-h-44 space-y-2 rounded-evvnt-md border border-dashed border-evvnt-n300 bg-evvnt-mist p-2.5"
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => applyDrop(activePage)}
        >
          {pageBlocks.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-evvnt-sm border border-evvnt-n200 bg-white text-[11px] text-evvnt-n500">
              Drop blocks here to build this page.
            </div>
          ) : null}
          {pageBlocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => setDragState({ kind: "block", page: activePage, index })}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.stopPropagation();
                applyDrop(activePage, index);
              }}
              className={
                block.id === selectedBlockId
                  ? "rounded-evvnt-md border border-evvnt-muted bg-white p-1.5 shadow-[0_0_0_2px_rgb(124_58_237_/_10%)]"
                  : "rounded-evvnt-md border border-transparent bg-white p-1.5"
              }
            >
              <div className="mb-1 flex items-center justify-between text-[10px] text-evvnt-n500">
                <span className="inline-flex items-center gap-1">
                  <GripVertical className="size-3" />
                  {block.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedBlockId(block.id)}
                    className="inline-flex items-center rounded-evvnt-sm border border-evvnt-n200 px-1.5 py-0.5 text-[10px] text-evvnt-n500"
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(activePage, block.id)}
                    className="inline-flex items-center gap-1 rounded-evvnt-sm border border-evvnt-n200 px-1.5 py-0.5 text-[10px] text-evvnt-n500"
                  >
                    <Trash2 className="size-3" />
                    Remove
                  </button>
                </div>
              </div>
              {renderCanvasBlock(block)}
            </div>
          ))}
        </div>
        <div className="rounded-evvnt-md border border-evvnt-n200 bg-white p-2.5">
          <p className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
            Guest runtime preview
          </p>
          <InviteGuestSitePreview
            eventType={eventType}
            rsvpFlow={rsvpFlow}
            guestExperience={guestExperience}
            title={title}
            subject={subject}
            message={message}
            eventDate={eventDate}
            venue={venue}
            dressCode={dressCode}
            heroImageUrl={heroImageUrl}
            heroVideoUrl={heroVideoUrl}
            galleryImageUrls={galleryImageUrls}
            galleryVideoUrls={galleryVideoUrls}
            sections={sectionsFromDocument(blocksByPage)}
          />
        </div>
      </section>

      <aside className="space-y-3 rounded-evvnt-lg border border-evvnt-n200 bg-white p-3">
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Inspector</p>
          {selectedBlock ? (
            <div className="mt-2 space-y-2">
              <div className="rounded-evvnt-sm border border-evvnt-n200 bg-evvnt-mist px-2.5 py-2 text-[11px] text-evvnt-n700">
                Selected: <span className="font-semibold">{selectedBlock.type}</span>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Display style
                </span>
                <select
                  value={selectedBlock.style}
                  onChange={(event) =>
                    updateBlockStyle(activePage, selectedBlock.id, event.target.value as SiteBuilderBlock["style"])
                  }
                  className="h-8 rounded-evvnt-sm border border-evvnt-n200 bg-white px-2 text-[11px] text-evvnt-ink"
                >
                  <option value="soft">Soft</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => removeBlock(activePage, selectedBlock.id)}
                className="inline-flex items-center gap-1 rounded-evvnt-sm border border-evvnt-danger-light bg-evvnt-danger-subtle px-2 py-1 text-[11px] text-evvnt-danger"
              >
                <Trash2 className="size-3" />
                Delete block
              </button>
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-evvnt-n500">Select a block to edit style and settings.</p>
          )}
        </div>

        <div className="border-evvnt-n100 border-t pt-3">
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">Section visibility</p>
          <div className="mt-2 space-y-1 text-[11px] text-evvnt-n600">
            {Object.entries(sectionsFromDocument(blocksByPage)).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-evvnt-sm bg-evvnt-mist px-2 py-1">
                <span>{key}</span>
                <span className={value ? "text-evvnt-success" : "text-evvnt-n400"}>{value ? "on" : "off"}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export type { SiteBuilderDocument, SiteBuilderPageId, SiteBuilderBlock, SiteBuilderBlockType } from "./site-builder.types";
