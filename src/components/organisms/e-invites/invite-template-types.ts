export type TemplateEventType = "wedding" | "birthday" | "funeral" | "corporate";
export type TemplateSectionId =
  | "hero"
  | "story"
  | "schedule"
  | "travel"
  | "registry"
  | "gallery"
  | "rsvp"
  | "faq"
  | "map";
export type TemplateSections = Record<TemplateSectionId, boolean>;
export type TemplateRsvpFlow = "simple" | "detailed" | "household";

export type TemplateGuestExperience = {
  guestAppEnabled: boolean;
  sharedAlbumEnabled: boolean;
  allowGuestUploads: boolean;
};

export type InviteGuestSiteModel = {
  eventType: TemplateEventType;
  rsvpFlow: TemplateRsvpFlow;
  guestExperience: TemplateGuestExperience;
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
};
