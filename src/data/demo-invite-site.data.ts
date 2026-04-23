import type { InviteGuestSiteModel } from "@organisms/e-invites";

const baseInviteSite: InviteGuestSiteModel = {
  eventType: "wedding",
  rsvpFlow: "detailed",
  guestExperience: {
    guestAppEnabled: true,
    sharedAlbumEnabled: true,
    allowGuestUploads: true,
  },
  title: "Okonkwo Wedding Celebration",
  subject: "You're invited: Okonkwo Wedding",
  message:
    "Join us for a joyful day of love, gratitude, and celebration. RSVP to confirm your attendance and see all guest details.",
  eventDate: "2026-12-05",
  venue: "The Grand Hall, Lagos",
  dressCode: "Black tie optional",
  heroImageUrl:
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=80",
  heroVideoUrl: undefined,
  galleryImageUrls: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  ],
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
    map: true,
  },
};

export const demoInviteSiteBySlug: Record<string, InviteGuestSiteModel> = {
  "okonkwo-wedding": baseInviteSite,
  "corporate-summit": {
    ...baseInviteSite,
    eventType: "corporate",
    rsvpFlow: "simple",
    title: "Evvnt Product Summit 2026",
    subject: "Invitation: Evvnt Product Summit 2026",
    message:
      "Join industry leaders for strategy sessions, roadmap showcases, and networking opportunities.",
    eventDate: "2026-08-14",
    venue: "Eko Convention Centre",
    dressCode: "Business formal",
    guestExperience: {
      guestAppEnabled: true,
      sharedAlbumEnabled: false,
      allowGuestUploads: false,
    },
  },
};
