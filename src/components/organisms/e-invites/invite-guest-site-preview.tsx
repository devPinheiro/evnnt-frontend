import { useMemo, useState } from "react";
import type { InviteGuestSiteModel, TemplateEventType } from "./invite-template-types";

type GuestSitePreviewProps = InviteGuestSiteModel & {
  onGalleryImageRemove?: (index: number) => void;
  onGalleryVideoRemove?: (index: number) => void;
};

type SitePage = "home" | "schedule" | "travel" | "registry" | "rsvp" | "album" | "faq";

const eventTagline: Record<TemplateEventType, string> = {
  wedding: "Celebrating love, family, and forever moments",
  birthday: "A fun celebration with stories, photos, and RSVP",
  funeral: "Honoring a life with reflection and remembrance",
  corporate: "A focused event hub for guests and attendees",
};

const pageLabel: Record<SitePage, string> = {
  home: "Home",
  schedule: "Schedule",
  travel: "Travel",
  registry: "Registry",
  rsvp: "RSVP",
  album: "Album",
  faq: "FAQ",
};

export function InviteGuestSitePreview({
  eventType,
  rsvpFlow,
  guestExperience,
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
  onGalleryImageRemove,
  onGalleryVideoRemove,
}: GuestSitePreviewProps) {
  const [activePage, setActivePage] = useState<SitePage>("home");
  const [guestUploads, setGuestUploads] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [mealChoice, setMealChoice] = useState("chicken");
  const [householdCount, setHouseholdCount] = useState("2");

  const visiblePages = useMemo(
    () =>
      [
        sections.hero || sections.story ? "home" : null,
        sections.schedule ? "schedule" : null,
        sections.travel ? "travel" : null,
        sections.registry ? "registry" : null,
        sections.rsvp ? "rsvp" : null,
        sections.gallery ? "album" : null,
        sections.faq ? "faq" : null,
      ].filter((x): x is SitePage => x != null),
    [sections],
  );

  const navPages = visiblePages.length > 0 ? visiblePages : (["home"] as SitePage[]);
  const resolvedPage = navPages.includes(activePage) ? activePage : navPages[0];
  const weddingRsvpDeadline = eventDate
    ? new Date(new Date(eventDate).getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
    : null;

  function addGuestUploads(files: FileList | null) {
    if (!files || files.length === 0) return;
    const nextUrls = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    setGuestUploads((prev) => [...prev, ...nextUrls].slice(0, 12));
  }

  return (
    <article className="relative overflow-hidden rounded-evvnt-xl border border-evvnt-n200 bg-white shadow-[0_8px_26px_-12px_rgb(26_9_51_/_20%)]">
      <div
        className="relative border-b border-evvnt-n100 p-4 text-white"
        style={{
          backgroundImage: heroImageUrl
            ? `linear-gradient(0deg, rgb(13 16 31 / 70%), rgb(13 16 31 / 55%)), url(${heroImageUrl})`
            : undefined,
          backgroundColor: heroImageUrl ? undefined : "#22113f",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(255_255_255_/_0.15),transparent_55%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-2 text-[10px]">
            <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold">
              {guestExperience.guestAppEnabled ? "Guest-facing app" : "Website-only experience"}
            </span>
            <span className="text-white/80">evvnt.site</span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-tight">{subject || title || "Event website"}</h3>
          <p className="mt-1 text-xs text-white/85">{eventTagline[eventType]}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-evvnt-n100 px-3 py-2">
        {navPages.map((page) => {
          const selected = page === resolvedPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => setActivePage(page)}
              className={
                selected
                  ? "rounded-full bg-evvnt-core px-3 py-1 text-[11px] font-semibold text-white"
                  : "rounded-full border border-evvnt-n200 px-3 py-1 text-[11px] text-evvnt-n600 hover:border-evvnt-n300"
              }
            >
              {pageLabel[page]}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 p-3">
        {resolvedPage === "home" ? (
          <section className="space-y-3">
            {eventType === "wedding" ? (
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-2.5">
                  <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                    Date
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-evvnt-n700">{eventDate || "To be announced"}</p>
                </div>
                <div className="rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-2.5">
                  <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                    Venue
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-evvnt-n700">{venue || "Venue details soon"}</p>
                </div>
                <div className="rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-2.5">
                  <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                    Dress code
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-evvnt-n700">
                    {dressCode || "Formal celebration"}
                  </p>
                </div>
              </div>
            ) : null}
            {sections.story ? (
              <div className="rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
                <div className="mb-1 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Story
                </div>
                <p className="text-[12px] leading-relaxed text-evvnt-n700">
                  {message || "Guests see your event story and welcome note here."}
                </p>
              </div>
            ) : null}
            {heroVideoUrl ? (
              <div className="overflow-hidden rounded-evvnt-md border border-evvnt-n100">
                <video src={heroVideoUrl} controls muted playsInline className="h-44 w-full object-cover" />
              </div>
            ) : null}
          </section>
        ) : null}

        {resolvedPage === "schedule" ? (
          <section className="space-y-2 rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
            <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Event timeline
            </div>
            {(eventType === "wedding"
              ? [
                  "Guest arrival and welcome drinks - 2:30 PM",
                  "Ceremony begins - 3:30 PM",
                  "Cocktail hour and photos - 5:00 PM",
                  "Reception dinner and toasts - 6:30 PM",
                ]
              : [
                  "Arrival and welcome - 3:00 PM",
                  "Main ceremony - 4:00 PM",
                  "Reception and networking - 6:00 PM",
                ]
            ).map((item) => (
              <div key={item} className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
                {item}
              </div>
            ))}
            {sections.map ? (
              <div className="rounded-evvnt-sm border border-dashed border-evvnt-n300 bg-white px-2.5 py-2 text-[11px] text-evvnt-n500">
                Map section enabled - venue directions displayed here.
              </div>
            ) : null}
          </section>
        ) : null}

        {resolvedPage === "travel" ? (
          <section className="space-y-2 rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
            <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Travel & accommodations
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              Recommended hotels near {venue || "the venue"} with discounted room blocks.
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              Shuttle pickup starts 45 minutes before ceremony.
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              Parking and local transport options are listed for out-of-town guests.
            </div>
          </section>
        ) : null}

        {resolvedPage === "registry" ? (
          <section className="space-y-2 rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
            <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Registry
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              One registry hub with curated gifts and optional contribution funds.
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              "Your presence is our greatest gift" messaging can be customized by hosts.
            </div>
          </section>
        ) : null}

        {resolvedPage === "rsvp" ? (
          <section className="rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
            <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              RSVP flow ({rsvpFlow})
            </div>
            <div className="space-y-2">
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Guest name"
                className="h-9 w-full rounded-evvnt-sm border border-evvnt-n200 bg-white px-2.5 text-xs text-evvnt-ink"
              />
              <input
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Email address"
                className="h-9 w-full rounded-evvnt-sm border border-evvnt-n200 bg-white px-2.5 text-xs text-evvnt-ink"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAttending("yes")}
                  className={
                    attending === "yes"
                      ? "rounded-evvnt-sm bg-evvnt-core px-2.5 py-1 text-[11px] font-semibold text-white"
                      : "rounded-evvnt-sm border border-evvnt-n200 px-2.5 py-1 text-[11px] text-evvnt-n600"
                  }
                >
                  Attending
                </button>
                <button
                  type="button"
                  onClick={() => setAttending("no")}
                  className={
                    attending === "no"
                      ? "rounded-evvnt-sm bg-evvnt-core px-2.5 py-1 text-[11px] font-semibold text-white"
                      : "rounded-evvnt-sm border border-evvnt-n200 px-2.5 py-1 text-[11px] text-evvnt-n600"
                  }
                >
                  Not attending
                </button>
              </div>
              {rsvpFlow === "detailed" ? (
                <select
                  value={mealChoice}
                  onChange={(e) => setMealChoice(e.target.value)}
                  className="h-9 w-full rounded-evvnt-sm border border-evvnt-n200 bg-white px-2.5 text-xs text-evvnt-ink"
                >
                  <option value="chicken">Meal choice: Chicken</option>
                  <option value="fish">Meal choice: Fish</option>
                  <option value="vegan">Meal choice: Vegan</option>
                </select>
              ) : null}
              {rsvpFlow === "household" ? (
                <input
                  value={householdCount}
                  onChange={(e) => setHouseholdCount(e.target.value)}
                  placeholder="Household attendees"
                  className="h-9 w-full rounded-evvnt-sm border border-evvnt-n200 bg-white px-2.5 text-xs text-evvnt-ink"
                />
              ) : null}
              <button
                type="button"
                className="w-full rounded-evvnt-sm bg-evvnt-core px-2.5 py-2 text-[11px] font-semibold text-white"
              >
                Submit RSVP
              </button>
              {eventType === "wedding" ? (
                <div className="rounded-evvnt-sm border border-dashed border-evvnt-n300 bg-white px-2.5 py-2 text-[11px] text-evvnt-n600">
                  RSVP deadline: {weddingRsvpDeadline ?? "Two weeks before event day"}.
                  Include dietary needs, plus-one preferences, and song requests.
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {resolvedPage === "album" ? (
          <section className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {galleryImageUrls.slice(0, 9).map((url, index) => (
                <div key={url} className="group relative overflow-hidden rounded-evvnt-sm">
                  <img src={url} alt={`Album ${index + 1}`} className="h-20 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onGalleryImageRemove?.(index)}
                    className="absolute right-1 top-1 rounded bg-black/55 px-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    x
                  </button>
                </div>
              ))}
              {galleryVideoUrls.slice(0, 3).map((url, index) => (
                <div key={url} className="group relative overflow-hidden rounded-evvnt-sm">
                  <video src={url} controls muted playsInline className="h-20 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onGalleryVideoRemove?.(index)}
                    className="absolute right-1 top-1 rounded bg-black/55 px-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            {guestExperience.sharedAlbumEnabled ? (
              <div className="rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
                <div className="mb-1 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Shared album
                </div>
                <p className="mb-2 text-[11px] text-evvnt-n600">
                  Guests can view and contribute memories in real time.
                </p>
                {guestExperience.allowGuestUploads ? (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => addGuestUploads(e.target.files)}
                    className="w-full text-[11px] text-evvnt-n500"
                  />
                ) : (
                  <p className="text-[11px] text-evvnt-n500">Guest uploads are disabled.</p>
                )}
                {guestUploads.length > 0 ? (
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {guestUploads.map((url) => (
                      <img key={url} src={url} alt="Guest upload" className="h-12 w-full rounded object-cover" />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {resolvedPage === "faq" ? (
          <section className="space-y-2 rounded-evvnt-md border border-evvnt-n100 bg-evvnt-mist p-3">
            <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              Guest FAQ
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              Can I bring a plus-one? Check your RSVP invite details.
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              Are children invited? Only if listed on your invitation party.
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              What should I wear? {dressCode || "Formal attire"}.
            </div>
            <div className="rounded-evvnt-sm bg-white px-2.5 py-2 text-[12px] text-evvnt-n700">
              Where is the venue? {venue || "Venue details provided in travel section"}.
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
