import { http } from "@/lib/http";
import endpoints from "@endpoints";
import { type ApiSuccess, unwrap } from "@types";

export type InviteChannel = "email" | "whatsapp";
export type InviteCampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";

export type InviteTemplateRow = {
  id: string;
  name: string;
  subject: string;
  body: string;
  channels: InviteChannel[];
  updatedAt: string;
};

export type InviteAudienceRow = {
  id: string;
  label: string;
  count: number;
  hint?: string | null;
};

export type InviteCampaignRow = {
  id: string;
  eventId: string;
  templateId?: string | null;
  audienceId: string;
  title: string;
  subject: string;
  message: string;
  channels: InviteChannel[];
  status: InviteCampaignStatus;
  scheduledAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
  stats?: {
    delivered: number;
    opened: number;
    clicked: number;
    rsvpConversions: number;
  };
};

export type CreateInviteCampaignBody = {
  eventId: string;
  title: string;
  templateId?: string;
  audienceId: string;
  subject: string;
  message: string;
  channels: InviteChannel[];
  scheduledAt?: string | null;
};

export type SendInviteCampaignBody = {
  channels?: InviteChannel[];
  sendNow?: boolean;
  scheduledAt?: string | null;
};

export type InviteMediaKind = "hero-image" | "hero-video" | "gallery-image" | "gallery-video";

export type InviteUploadedAsset = {
  url: string;
};

export type InvitePublicSite = {
  eventType: "wedding" | "birthday" | "funeral" | "corporate";
  rsvpFlow: "simple" | "detailed" | "household";
  guestExperience: {
    guestAppEnabled: boolean;
    sharedAlbumEnabled: boolean;
    allowGuestUploads: boolean;
  };
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
  sections: {
    hero: boolean;
    story: boolean;
    schedule: boolean;
    travel: boolean;
    registry: boolean;
    gallery: boolean;
    rsvp: boolean;
    faq: boolean;
    map: boolean;
  };
};

export type InviteSiteConfigBody = InvitePublicSite & {
  eventId: string;
  slug: string;
  templateId?: string;
  published?: boolean;
};

export type InviteSiteStatus = {
  slug: string;
  published: boolean;
};

export async function listInviteCampaigns(eventId?: string) {
  const { data } = await http.get<ApiSuccess<{ campaigns: InviteCampaignRow[] }>>(
    endpoints.invites.campaigns,
    { params: eventId ? { eventId } : undefined },
  );
  return unwrap(data).campaigns;
}

export async function listInviteTemplates(eventId?: string) {
  const { data } = await http.get<ApiSuccess<{ templates: InviteTemplateRow[] }>>(
    endpoints.invites.templates,
    { params: eventId ? { eventId } : undefined },
  );
  return unwrap(data).templates;
}

export async function listInviteAudiences(eventId?: string) {
  const { data } = await http.get<ApiSuccess<{ audiences: InviteAudienceRow[] }>>(
    endpoints.invites.audiences,
    { params: eventId ? { eventId } : undefined },
  );
  return unwrap(data).audiences;
}

export async function createInviteCampaign(body: CreateInviteCampaignBody) {
  const { data } = await http.post<ApiSuccess<{ campaign: InviteCampaignRow }>>(
    endpoints.invites.campaigns,
    body,
  );
  return unwrap(data).campaign;
}

export async function sendInviteCampaign(campaignId: string, body?: SendInviteCampaignBody) {
  const { data } = await http.post<ApiSuccess<{ campaign: InviteCampaignRow }>>(
    endpoints.invites.send(campaignId),
    body,
  );
  return unwrap(data).campaign;
}

function resolveUploadUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const typed = payload as Record<string, unknown>;
  if (typeof typed.url === "string") return typed.url;
  if (typeof typed.fileUrl === "string") return typed.fileUrl;
  if (typed.asset && typeof typed.asset === "object") {
    const asset = typed.asset as Record<string, unknown>;
    if (typeof asset.url === "string") return asset.url;
    if (typeof asset.fileUrl === "string") return asset.fileUrl;
  }
  return null;
}

export async function uploadInviteMedia(params: {
  eventId: string;
  kind: InviteMediaKind;
  file: File;
  onProgress?: (percentage: number) => void;
}): Promise<InviteUploadedAsset> {
  const body = new FormData();
  body.append("eventId", params.eventId);
  body.append("kind", params.kind);
  body.append("file", params.file);

  const { data } = await http.post<ApiSuccess<unknown>>(endpoints.invites.uploadMedia, body, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (!evt.total || !params.onProgress) return;
      const percentage = Math.min(100, Math.round((evt.loaded / evt.total) * 100));
      params.onProgress(percentage);
    },
  });

  const payload = unwrap(data);
  const url = resolveUploadUrl(payload);
  if (!url) {
    throw new Error("Upload succeeded but no media URL was returned.");
  }
  return { url };
}

function asRecord(x: unknown): Record<string, unknown> | null {
  return typeof x === "object" && x != null ? (x as Record<string, unknown>) : null;
}

function asStringArray(x: unknown): string[] {
  return Array.isArray(x) ? x.filter((item): item is string => typeof item === "string") : [];
}

function normalizePublicSite(payload: unknown): InvitePublicSite {
  const root = asRecord(payload);
  const source = asRecord(root?.site) ?? root ?? {};
  const guestExperience = asRecord(source.guestExperience);
  const sections = asRecord(source.sections);

  return {
    eventType:
      source.eventType === "birthday" ||
      source.eventType === "funeral" ||
      source.eventType === "corporate"
        ? source.eventType
        : "wedding",
    rsvpFlow:
      source.rsvpFlow === "detailed" || source.rsvpFlow === "household"
        ? source.rsvpFlow
        : "simple",
    guestExperience: {
      guestAppEnabled: Boolean(guestExperience?.guestAppEnabled ?? true),
      sharedAlbumEnabled: Boolean(guestExperience?.sharedAlbumEnabled ?? true),
      allowGuestUploads: Boolean(guestExperience?.allowGuestUploads ?? true),
    },
    title: typeof source.title === "string" && source.title.length > 0 ? source.title : "Event Invitation",
    subject: typeof source.subject === "string" && source.subject.length > 0 ? source.subject : "You're invited",
    message:
      typeof source.message === "string" && source.message.length > 0
        ? source.message
        : "This invite link is active. Full event details will be available soon.",
    eventDate:
      typeof source.eventDate === "string" && source.eventDate.length > 0
        ? source.eventDate
        : undefined,
    venue: typeof source.venue === "string" && source.venue.length > 0 ? source.venue : undefined,
    dressCode:
      typeof source.dressCode === "string" && source.dressCode.length > 0
        ? source.dressCode
        : undefined,
    heroImageUrl:
      typeof source.heroImageUrl === "string" && source.heroImageUrl.length > 0
        ? source.heroImageUrl
        : undefined,
    heroVideoUrl:
      typeof source.heroVideoUrl === "string" && source.heroVideoUrl.length > 0
        ? source.heroVideoUrl
        : undefined,
    galleryImageUrls: asStringArray(source.galleryImageUrls),
    galleryVideoUrls: asStringArray(source.galleryVideoUrls),
    sections: {
      hero: Boolean(sections?.hero ?? true),
      story: Boolean(sections?.story ?? true),
      schedule: Boolean(sections?.schedule ?? true),
      travel: Boolean(sections?.travel ?? true),
      registry: Boolean(sections?.registry ?? true),
      gallery: Boolean(sections?.gallery ?? true),
      rsvp: Boolean(sections?.rsvp ?? true),
      faq: Boolean(sections?.faq ?? true),
      map: Boolean(sections?.map ?? false),
    },
  };
}

export async function getInvitePublicSite(slug: string): Promise<InvitePublicSite> {
  const { data } = await http.get<ApiSuccess<unknown>>(endpoints.invites.publicSite(slug));
  return normalizePublicSite(unwrap(data));
}

function normalizeSiteStatus(payload: unknown, fallbackSlug: string): InviteSiteStatus {
  const root = asRecord(payload);
  const source = asRecord(root?.site) ?? root ?? {};
  return {
    slug: typeof source.slug === "string" && source.slug.length > 0 ? source.slug : fallbackSlug,
    published: Boolean(source.published),
  };
}

export async function upsertInviteSite(body: InviteSiteConfigBody): Promise<InviteSiteStatus> {
  const { data } = await http.post<ApiSuccess<unknown>>(endpoints.invites.sites, body);
  return normalizeSiteStatus(unwrap(data), body.slug);
}

export async function publishInviteSite(slug: string, eventId: string): Promise<InviteSiteStatus> {
  const { data } = await http.post<ApiSuccess<unknown>>(endpoints.invites.publishSite(slug), { eventId });
  return normalizeSiteStatus(unwrap(data), slug);
}

export async function unpublishInviteSite(slug: string, eventId: string): Promise<InviteSiteStatus> {
  const { data } = await http.post<ApiSuccess<unknown>>(endpoints.invites.unpublishSite(slug), {
    eventId,
  });
  return normalizeSiteStatus(unwrap(data), slug);
}
