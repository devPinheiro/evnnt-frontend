import { InviteWebsiteBuilder } from "./invite-website-builder";
import type {
  TemplateEventType,
  TemplateGuestExperience,
  TemplateRsvpFlow,
  TemplateSectionId,
  TemplateSections,
} from "./invite-template-types";
import type { SiteBuilderDocument } from "./site-builder.types";

type InviteTemplateEditorProps = {
  eventType: TemplateEventType;
  rsvpFlow: TemplateRsvpFlow;
  guestExperience: TemplateGuestExperience;
  onEventTypeChange: (type: TemplateEventType) => void;
  onRsvpFlowChange: (flow: TemplateRsvpFlow) => void;
  onGuestExperienceChange: (next: Partial<TemplateGuestExperience>) => void;
  title: string;
  subject: string;
  message: string;
  eventDate?: string;
  venue?: string;
  dressCode?: string;
  heroImageUrl?: string;
  heroVideoUrl?: string;
  galleryImageUrls: string[];
  galleryVideoUrls: string[];
  sections: TemplateSections;
  onHeroImageSelect?: (file: File | null) => void;
  onHeroVideoSelect?: (file: File | null) => void;
  onGalleryImagesAdd?: (files: File[]) => void;
  onGalleryVideosAdd?: (files: File[]) => void;
  onGalleryImageRemove?: (index: number) => void;
  onGalleryVideoRemove?: (index: number) => void;
  heroImageUploadProgress?: number | null;
  heroVideoUploadProgress?: number | null;
  galleryImageUploadCount?: number;
  galleryVideoUploadCount?: number;
  mediaUploadError?: string | null;
  onSectionToggle?: (section: TemplateSectionId) => void;
  onSectionsChange?: (next: TemplateSections) => void;
  onApplyEventDefaults?: (type: TemplateEventType) => void;
  siteBuilderDocument: SiteBuilderDocument;
  onSiteBuilderDocumentChange: (next: SiteBuilderDocument) => void;
};

const eventTypePresets: Record<
  TemplateEventType,
  {
    label: string;
    tone: string;
    gradient: string;
    overlayClass: string;
    badgeClass: string;
    accentClass: string;
    heroNote: string;
  }
> = {
  wedding: {
    label: "Wedding",
    tone: "Elegant, warm, and celebratory",
    gradient: "linear-gradient(135deg, #1f114d 0%, #4b1fa8 45%, #c084fc 100%)",
    overlayClass: "bg-white/10",
    badgeClass: "bg-white/20 text-white",
    accentClass: "text-[#f5e2ff]",
    heroNote: "Join us for a day of love and celebration.",
  },
  birthday: {
    label: "Birthday",
    tone: "Playful, bright, and energetic",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #db2777 50%, #f59e0b 100%)",
    overlayClass: "bg-white/12",
    badgeClass: "bg-white/20 text-white",
    accentClass: "text-[#fff1cc]",
    heroNote: "Come party with us and make unforgettable memories.",
  },
  funeral: {
    label: "Funeral",
    tone: "Respectful, calm, and reflective",
    gradient: "linear-gradient(135deg, #111827 0%, #374151 50%, #6b7280 100%)",
    overlayClass: "bg-white/8",
    badgeClass: "bg-white/15 text-white/90",
    accentClass: "text-[#d1d5db]",
    heroNote: "We gather to remember, honor, and support one another.",
  },
  corporate: {
    label: "Corporate",
    tone: "Clean, modern, and professional",
    gradient: "linear-gradient(135deg, #0b1b4d 0%, #1d4ed8 45%, #06b6d4 100%)",
    overlayClass: "bg-white/10",
    badgeClass: "bg-white/20 text-white",
    accentClass: "text-[#dbeafe]",
    heroNote: "Be part of an insightful and high-impact experience.",
  },
};

const eventTypeOrder: TemplateEventType[] = ["wedding", "birthday", "funeral", "corporate"];
const sectionLabels: Record<TemplateSectionId, string> = {
  hero: "Hero",
  story: "Story",
  schedule: "Schedule",
  travel: "Travel",
  registry: "Registry",
  gallery: "Gallery",
  rsvp: "RSVP",
  faq: "FAQ",
  map: "Map",
};

export function InviteTemplateEditor({
  eventType,
  rsvpFlow,
  guestExperience,
  onEventTypeChange,
  onRsvpFlowChange,
  onGuestExperienceChange,
  title,
  subject,
  message,
  eventDate,
  venue,
  dressCode,
  heroImageUrl,
  heroVideoUrl,
  galleryImageUrls,
  galleryVideoUrls,
  sections,
  onHeroImageSelect,
  onHeroVideoSelect,
  onGalleryImagesAdd,
  onGalleryVideosAdd,
  heroImageUploadProgress,
  heroVideoUploadProgress,
  galleryImageUploadCount = 0,
  galleryVideoUploadCount = 0,
  mediaUploadError,
  onSectionToggle,
  onSectionsChange,
  onApplyEventDefaults,
  siteBuilderDocument,
  onSiteBuilderDocumentChange,
}: InviteTemplateEditorProps) {
  const preset = eventTypePresets[eventType];

  return (
    <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
      <div className="border-b border-evvnt-n100 px-4 py-3.5">
        <h2 className="text-[13px] font-semibold tracking-tight text-evvnt-ink">
          Template editor module
        </h2>
        <p className="mt-0.5 text-[11px] text-evvnt-n500">
          Build a unique invite website style by event type.
        </p>
      </div>
      <div className="grid gap-4 p-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Event type
            </div>
            <div className="grid grid-cols-2 gap-2">
              {eventTypeOrder.map((type) => {
                const selected = type === eventType;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onEventTypeChange(type)}
                    className={
                      selected
                        ? "rounded-evvnt-md border border-evvnt-muted bg-evvnt-tint px-2.5 py-2 text-[11px] font-semibold text-evvnt-core"
                        : "rounded-evvnt-md border border-evvnt-n200 px-2.5 py-2 text-[11px] font-medium text-evvnt-n600 hover:border-evvnt-muted"
                    }
                  >
                    {eventTypePresets[type].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-3 py-2.5">
            <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Style intent
            </div>
            <p className="mt-1 text-[11px] text-evvnt-n600">{preset.tone}</p>
          </div>

          {eventType === "wedding" ? (
            <div className="rounded-evvnt-md border border-evvnt-muted bg-evvnt-tint px-3 py-2.5">
              <div className="text-[10px] font-semibold tracking-wide text-evvnt-core uppercase">
                Wedding website blueprint
              </div>
              <ul className="mt-1 space-y-1 text-[11px] text-evvnt-core/90">
                <li>Welcome page with story and key details</li>
                <li>Schedule + travel/accommodation guidance</li>
                <li>RSVP with deadline and guest questions</li>
                <li>Registry, FAQ, and shared photo moments</li>
              </ul>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => onApplyEventDefaults?.(eventType)}
            className="w-full rounded-evvnt-md border border-evvnt-muted bg-evvnt-tint px-3 py-2 text-[11px] font-semibold text-evvnt-core hover:bg-white"
          >
            Apply {preset.label.toLowerCase()} defaults
          </button>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Website sections
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(sectionLabels) as TemplateSectionId[]).map((section) => (
                <label
                  key={section}
                  className="flex items-center gap-1.5 text-[11px] text-evvnt-n600"
                >
                  <input
                    type="checkbox"
                    checked={sections[section]}
                    onChange={() => onSectionToggle?.(section)}
                  />
                  {sectionLabels[section]}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              RSVP flow
            </div>
            <select
              value={rsvpFlow}
              onChange={(e) => onRsvpFlowChange(e.target.value as TemplateRsvpFlow)}
              className="h-9 w-full rounded-evvnt-md border border-evvnt-n200 bg-white px-2.5 text-[11px] text-evvnt-ink outline-none"
            >
              <option value="simple">Simple RSVP (yes/no)</option>
              <option value="detailed">Detailed RSVP (meal + questions)</option>
              <option value="household">Household RSVP (+1 & groups)</option>
            </select>
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Hero image
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onHeroImageSelect?.(e.target.files?.[0] ?? null)}
              className="w-full text-[11px] text-evvnt-n500"
            />
            {heroImageUrl ? (
              <button
                type="button"
                onClick={() => onHeroImageSelect?.(null)}
                className="mt-2 text-[11px] font-medium text-evvnt-vivid hover:text-evvnt-core"
              >
                Remove hero image
              </button>
            ) : null}
            {heroImageUploadProgress != null ? (
              <p className="mt-1 text-[10px] text-evvnt-n400">
                Uploading hero image... {heroImageUploadProgress}%
              </p>
            ) : null}
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Hero video
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => onHeroVideoSelect?.(e.target.files?.[0] ?? null)}
              className="w-full text-[11px] text-evvnt-n500"
            />
            {heroVideoUrl ? (
              <button
                type="button"
                onClick={() => onHeroVideoSelect?.(null)}
                className="mt-2 text-[11px] font-medium text-evvnt-vivid hover:text-evvnt-core"
              >
                Remove hero video
              </button>
            ) : null}
            {heroVideoUploadProgress != null ? (
              <p className="mt-1 text-[10px] text-evvnt-n400">
                Uploading hero video... {heroVideoUploadProgress}%
              </p>
            ) : null}
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Gallery uploads
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                onGalleryImagesAdd?.(e.target.files ? Array.from(e.target.files) : [])
              }
              className="w-full text-[11px] text-evvnt-n500"
            />
            <p className="mt-1 text-[10px] text-evvnt-n400">{galleryImageUrls.length} image(s)</p>
            {galleryImageUploadCount > 0 ? (
              <p className="mt-1 text-[10px] text-evvnt-n400">
                Uploading {galleryImageUploadCount} image(s)...
              </p>
            ) : null}
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Gallery videos
            </div>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) =>
                onGalleryVideosAdd?.(e.target.files ? Array.from(e.target.files) : [])
              }
              className="w-full text-[11px] text-evvnt-n500"
            />
            <p className="mt-1 text-[10px] text-evvnt-n400">{galleryVideoUrls.length} video(s)</p>
            {galleryVideoUploadCount > 0 ? (
              <p className="mt-1 text-[10px] text-evvnt-n400">
                Uploading {galleryVideoUploadCount} video(s)...
              </p>
            ) : null}
          </div>

          <div className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Guest app & shared albums
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] text-evvnt-n600">
                <input
                  type="checkbox"
                  checked={guestExperience.guestAppEnabled}
                  onChange={(e) => onGuestExperienceChange({ guestAppEnabled: e.target.checked })}
                />
                Guest-facing app enabled
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-evvnt-n600">
                <input
                  type="checkbox"
                  checked={guestExperience.sharedAlbumEnabled}
                  onChange={(e) =>
                    onGuestExperienceChange({ sharedAlbumEnabled: e.target.checked })
                  }
                />
                Shared albums enabled
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-evvnt-n600">
                <input
                  type="checkbox"
                  checked={guestExperience.allowGuestUploads}
                  onChange={(e) => onGuestExperienceChange({ allowGuestUploads: e.target.checked })}
                />
                Allow guest photo uploads
              </label>
            </div>
          </div>

          {mediaUploadError ? (
            <div className="rounded-evvnt-md border border-evvnt-danger-light bg-evvnt-danger-subtle px-3 py-2 text-[11px] text-evvnt-danger">
              {mediaUploadError}
            </div>
          ) : null}
        </div>

        <InviteWebsiteBuilder
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
          document={siteBuilderDocument}
          onDocumentChange={onSiteBuilderDocumentChange}
          onSectionsChange={onSectionsChange}
        />
      </div>
    </section>
  );
}

export type { TemplateEventType, TemplateGuestExperience, TemplateRsvpFlow, TemplateSections };
