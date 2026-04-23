import { demoInviteSiteBySlug } from "@data";
import { InviteGuestSitePreview, type InviteGuestSiteModel } from "@organisms/e-invites";
import { useInvitePublicSite } from "@/services/invites.services";
import { Button } from "@ui/button";

type InviteGuestSitePageProps = {
  slug: string;
};

const fallbackSite: InviteGuestSiteModel = {
  eventType: "wedding",
  rsvpFlow: "simple",
  guestExperience: {
    guestAppEnabled: true,
    sharedAlbumEnabled: true,
    allowGuestUploads: true,
  },
  title: "Event Invitation",
  subject: "You're invited",
  message: "This invite link is active. Full event details will be available soon.",
  galleryImageUrls: [],
  galleryVideoUrls: [],
  sections: {
    hero: true,
    story: true,
    schedule: true,
    travel: true,
    registry: true,
    gallery: true,
    rsvp: true,
    faq: true,
    map: false,
  },
};

function toHeading(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();
}

export function InviteGuestSitePage({ slug }: InviteGuestSitePageProps) {
  const { data: liveSite, error: liveSiteError, isPending } = useInvitePublicSite(slug);
  const site =
    liveSite ??
    demoInviteSiteBySlug[slug] ?? {
      ...fallbackSite,
      title: toHeading(slug) || "Event Invitation",
    };

  return (
    <main className="min-h-screen bg-evvnt-mist px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <header className="rounded-evvnt-xl border border-evvnt-n200 bg-white px-4 py-3 shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
          <p className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
            Public guest site
          </p>
          <h1 className="mt-1 text-base font-semibold text-evvnt-ink">{site.subject}</h1>
          <p className="mt-1 text-xs text-evvnt-n500">Slug: /invite/{slug}</p>
          {isPending ? (
            <p className="mt-1 text-xs text-evvnt-n500">Loading live invite details...</p>
          ) : null}
          {liveSiteError ? (
            <p className="mt-1 text-xs text-evvnt-n500">
              Live invite data unavailable. Showing fallback content.
            </p>
          ) : null}
        </header>

        <InviteGuestSitePreview
          eventType={site.eventType}
          rsvpFlow={site.rsvpFlow}
          guestExperience={site.guestExperience}
          title={site.title}
          subject={site.subject}
          message={site.message}
          eventDate={site.eventDate}
          venue={site.venue}
          dressCode={site.dressCode}
          heroImageUrl={site.heroImageUrl}
          heroVideoUrl={site.heroVideoUrl}
          galleryImageUrls={site.galleryImageUrls}
          galleryVideoUrls={site.galleryVideoUrls}
          sections={site.sections}
        />

        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => window.location.assign("/events/invites")}>
            Back to editor
          </Button>
        </div>
      </div>
    </main>
  );
}
