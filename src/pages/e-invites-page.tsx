import { getApiErrorMessage } from "@/lib/api-error";
import type {
  CreateInviteCampaignBody,
  InviteCampaignRow,
  InviteTemplateRow,
} from "@/services/invites.services";
import {
  useCreateInviteCampaign,
  useListInviteAudiences,
  useListInviteCampaigns,
  useListInviteTemplates,
  usePublishInviteSite,
  useSendInviteCampaign,
  useUnpublishInviteSite,
  useUpsertInviteSite,
  useUploadInviteMedia,
} from "@/services/invites.services";
import {
  demoInviteAudiences,
  demoInviteCampaigns,
  demoInviteKpis,
  demoInviteTemplates,
} from "@data";
import {
  EInvitesPageSkeleton,
  InviteAudiencePanel,
  InviteComposer,
  InviteKpis,
  InviteRecentSends,
  InviteTemplateEditor,
  type TemplateEventType,
  type TemplateGuestExperience,
  type TemplateRsvpFlow,
  type TemplateSections,
} from "@organisms/e-invites";
import {
  type InviteComposeValues,
  inviteComposeSchema,
  inviteSendSchema,
  inviteTemplateWebsiteSchema,
} from "@schemas";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@ui/dialog";
import { toast } from "@ui/sonner";
import { Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_EVENT_ID = "evt-okonkwo";
const DEFAULT_CHANNELS: Array<"email" | "whatsapp"> = ["email", "whatsapp"];
const LEAVE_CONFIRM_MSG = "You have unsaved invite changes. Leave this page anyway?";
const INVITE_DRAFT_STORAGE_PREFIX = "evvnt:e-invites:draft:";
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 30 * 1024 * 1024;

function toInviteSlug(input: string) {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return cleaned.length > 0 ? cleaned : "event-invite";
}

function toCreateInviteCampaignBody(values: InviteComposeValues): CreateInviteCampaignBody {
  return {
    eventId: values.eventId,
    title: values.title,
    templateId: values.templateId,
    audienceId: values.audienceId,
    subject: values.subject,
    message: values.message,
    channels: values.channels,
    scheduledAt: values.scheduledAt,
  };
}

type ComposerSnapshot = {
  templateId?: string;
  audienceId?: string;
  siteSlug: string;
  sitePublished: boolean;
  eventDate: string;
  venue: string;
  dressCode: string;
  eventType: TemplateEventType;
  heroImageUrl?: string;
  heroVideoUrl?: string;
  galleryImageUrls: string[];
  galleryVideoUrls: string[];
  sections: TemplateSections;
  rsvpFlow: TemplateRsvpFlow;
  guestExperience: TemplateGuestExperience;
  title: string;
  subject: string;
  message: string;
  channels: Array<"email" | "whatsapp">;
  sendNow: boolean;
  scheduledAt: string;
};

function parseStoredComposerSnapshot(raw: string | null): ComposerSnapshot | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ComposerSnapshot>;
    if (
      typeof parsed !== "object" ||
      parsed == null ||
      typeof parsed.subject !== "string" ||
      typeof parsed.message !== "string" ||
      typeof parsed.title !== "string" ||
      !Array.isArray(parsed.channels) ||
      typeof parsed.sendNow !== "boolean" ||
      typeof parsed.scheduledAt !== "string"
    ) {
      return null;
    }
    const channels = parsed.channels.filter(
      (ch): ch is "email" | "whatsapp" => ch === "email" || ch === "whatsapp",
    );
    return {
      templateId: typeof parsed.templateId === "string" ? parsed.templateId : undefined,
      audienceId: typeof parsed.audienceId === "string" ? parsed.audienceId : undefined,
      siteSlug:
        typeof parsed.siteSlug === "string" && parsed.siteSlug.trim().length > 0
          ? toInviteSlug(parsed.siteSlug)
          : toInviteSlug(parsed.title),
      sitePublished: Boolean(parsed.sitePublished),
      eventDate:
        typeof parsed.eventDate === "string" && parsed.eventDate.length > 0
          ? parsed.eventDate
          : new Date().toISOString().slice(0, 10),
      venue: typeof parsed.venue === "string" ? parsed.venue : "",
      dressCode: typeof parsed.dressCode === "string" ? parsed.dressCode : "",
      eventType:
        parsed.eventType === "birthday" ||
        parsed.eventType === "funeral" ||
        parsed.eventType === "corporate"
          ? parsed.eventType
          : "wedding",
      heroImageUrl:
        typeof parsed.heroImageUrl === "string" && parsed.heroImageUrl.length > 0
          ? parsed.heroImageUrl
          : undefined,
      heroVideoUrl:
        typeof parsed.heroVideoUrl === "string" && parsed.heroVideoUrl.length > 0
          ? parsed.heroVideoUrl
          : undefined,
      galleryImageUrls: Array.isArray(parsed.galleryImageUrls)
        ? parsed.galleryImageUrls.filter((x): x is string => typeof x === "string")
        : [],
      galleryVideoUrls: Array.isArray(parsed.galleryVideoUrls)
        ? parsed.galleryVideoUrls.filter((x): x is string => typeof x === "string")
        : [],
      sections:
        parsed.sections &&
        typeof parsed.sections === "object" &&
        parsed.sections != null &&
        "hero" in parsed.sections &&
        "story" in parsed.sections &&
        "schedule" in parsed.sections &&
        "travel" in parsed.sections &&
        "registry" in parsed.sections &&
        "gallery" in parsed.sections &&
        "rsvp" in parsed.sections &&
        "faq" in parsed.sections &&
        "map" in parsed.sections
          ? (parsed.sections as TemplateSections)
          : {
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
      rsvpFlow:
        parsed.rsvpFlow === "detailed" || parsed.rsvpFlow === "household"
          ? parsed.rsvpFlow
          : "simple",
      guestExperience:
        parsed.guestExperience &&
        typeof parsed.guestExperience === "object" &&
        parsed.guestExperience != null &&
        "guestAppEnabled" in parsed.guestExperience &&
        "sharedAlbumEnabled" in parsed.guestExperience &&
        "allowGuestUploads" in parsed.guestExperience
          ? (parsed.guestExperience as ComposerSnapshot["guestExperience"])
          : { guestAppEnabled: true, sharedAlbumEnabled: true, allowGuestUploads: true },
      title: parsed.title,
      subject: parsed.subject,
      message: parsed.message,
      channels,
      sendNow: parsed.sendNow,
      scheduledAt: parsed.scheduledAt,
    };
  } catch {
    return null;
  }
}

export function EInvitesPage() {
  const eventId = DEFAULT_EVENT_ID;
  const {
    data: campaignsData,
    error: campaignsError,
    isPending: campaignsPending,
  } = useListInviteCampaigns(eventId);
  const {
    data: audiencesData,
    error: audiencesError,
    isPending: audiencesPending,
  } = useListInviteAudiences(eventId);
  const {
    data: templatesData,
    error: templatesError,
    isPending: templatesPending,
  } = useListInviteTemplates(eventId);
  const createCampaign = useCreateInviteCampaign();
  const sendCampaign = useSendInviteCampaign();
  const uploadInviteMedia = useUploadInviteMedia();
  const upsertInviteSite = useUpsertInviteSite();
  const publishInviteSite = usePublishInviteSite();
  const unpublishInviteSite = useUnpublishInviteSite();

  const [title, setTitle] = useState("Main wedding invite");
  const [subject, setSubject] = useState("You're invited: Okonkwo Wedding");
  const [message, setMessage] = useState(
    "You're specially invited to celebrate with us. Tap RSVP to confirm your seat and access full event details.",
  );
  const [selectedAudienceId, setSelectedAudienceId] = useState<string | undefined>(undefined);
  const [channels, setChannels] = useState<Array<"email" | "whatsapp">>([...DEFAULT_CHANNELS]);
  const [sendNow, setSendNow] = useState(true);
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [siteSlug, setSiteSlug] = useState(toInviteSlug("Main wedding invite"));
  const [sitePublished, setSitePublished] = useState(false);
  const [siteSlugTouched, setSiteSlugTouched] = useState(false);
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [venue, setVenue] = useState("The Grand Hall, Lagos");
  const [dressCode, setDressCode] = useState("Formal");
  const [showValidation, setShowValidation] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | undefined>(undefined);
  const [templateEventType, setTemplateEventType] = useState<TemplateEventType>("wedding");
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(undefined);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | undefined>(undefined);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [galleryVideoUrls, setGalleryVideoUrls] = useState<string[]>([]);
  const [templateSections, setTemplateSections] = useState<TemplateSections>({
    hero: true,
    story: true,
    schedule: true,
    travel: true,
    registry: true,
    gallery: true,
    rsvp: true,
    faq: true,
    map: true,
  });
  const [rsvpFlow, setRsvpFlow] = useState<TemplateRsvpFlow>("simple");
  const [guestExperience, setGuestExperience] = useState<TemplateGuestExperience>({
    guestAppEnabled: true,
    sharedAlbumEnabled: true,
    allowGuestUploads: true,
  });
  const [heroImageUploadProgress, setHeroImageUploadProgress] = useState<number | null>(null);
  const [heroVideoUploadProgress, setHeroVideoUploadProgress] = useState<number | null>(null);
  const [galleryImageUploadCount, setGalleryImageUploadCount] = useState(0);
  const [galleryVideoUploadCount, setGalleryVideoUploadCount] = useState(0);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [templateEditorOpen, setTemplateEditorOpen] = useState(false);
  const baselineSnapshotRef = useRef<ComposerSnapshot | null>(null);
  const [hydratedDraft, setHydratedDraft] = useState(false);

  const audiences =
    audiencesData?.audiences && audiencesData.audiences.length > 0
      ? audiencesData.audiences
      : demoInviteAudiences;
  const campaigns =
    campaignsData?.campaigns && campaignsData.campaigns.length > 0
      ? campaignsData.campaigns
      : demoInviteCampaigns;
  const templates =
    templatesData?.templates && templatesData.templates.length > 0
      ? templatesData.templates
      : demoInviteTemplates;
  const resolvedTemplateId = selectedTemplateId ?? templates[0]?.id;

  const kpis = useMemo(() => {
    if (!campaignsData?.campaigns || campaignsData.campaigns.length === 0) {
      return demoInviteKpis;
    }
    const sentCampaigns = campaignsData.campaigns.filter((row) => row.status === "sent");
    const delivered = sentCampaigns.reduce((sum, row) => sum + (row.stats?.delivered ?? 0), 0);
    const opened = sentCampaigns.reduce((sum, row) => sum + (row.stats?.opened ?? 0), 0);
    const clicked = sentCampaigns.reduce((sum, row) => sum + (row.stats?.clicked ?? 0), 0);
    const conversions = sentCampaigns.reduce(
      (sum, row) => sum + (row.stats?.rsvpConversions ?? 0),
      0,
    );
    const openRate = delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
    const conversionRate = clicked > 0 ? Math.round((conversions / clicked) * 100) : 0;
    return [
      {
        id: "delivered",
        label: "Delivered today",
        value: delivered.toLocaleString(),
        hint: `Across ${sentCampaigns.length} campaigns`,
      },
      {
        id: "open-rate",
        label: "Open rate",
        value: `${openRate}%`,
        hint: `${opened.toLocaleString()} opens`,
      },
      {
        id: "rsvp-conv",
        label: "RSVP conversions",
        value: `${conversionRate}%`,
        hint: `${conversions.toLocaleString()} RSVP actions`,
      },
    ];
  }, [campaignsData?.campaigns]);

  const mediaUploadInFlight =
    uploadInviteMedia.isPending ||
    heroImageUploadProgress != null ||
    heroVideoUploadProgress != null ||
    galleryImageUploadCount > 0 ||
    galleryVideoUploadCount > 0;
  const siteMutationBusy =
    upsertInviteSite.isPending || publishInviteSite.isPending || unpublishInviteSite.isPending;
  const saveOrSendBusy =
    createCampaign.isPending || sendCampaign.isPending || mediaUploadInFlight || siteMutationBusy;
  const selectedAudience = selectedAudienceId ?? audiences[0]?.id;
  const firstError = campaignsError ?? audiencesError ?? templatesError;
  const isInitialLoading =
    campaignsPending &&
    audiencesPending &&
    templatesPending &&
    !campaignsData &&
    !audiencesData &&
    !templatesData;
  const composeValidation = inviteComposeSchema.safeParse({
    eventId,
    title,
    templateId: resolvedTemplateId,
    audienceId: selectedAudience,
    eventDate,
    venue,
    dressCode,
    subject,
    message,
    channels,
    scheduledAt: sendNow ? undefined : scheduledAt,
  });
  const sendValidation = inviteSendSchema.safeParse({
    campaignId: "placeholder",
    sendNow,
    scheduledAt: sendNow ? undefined : scheduledAt,
    channels,
  });
  const templateWebsiteValidation = inviteTemplateWebsiteSchema.safeParse({
    eventType: templateEventType,
    rsvpFlow,
    heroImageUrl,
    heroVideoUrl,
    galleryImageUrls,
    galleryVideoUrls,
    sections: templateSections,
    guestExperience,
  });
  const canSendNow =
    composeValidation.success &&
    sendValidation.success &&
    templateWebsiteValidation.success &&
    !mediaUploadInFlight &&
    !saveOrSendBusy;
  const composerSnapshot = useMemo<ComposerSnapshot>(
    () => ({
      templateId: resolvedTemplateId,
      audienceId: selectedAudience,
      siteSlug,
      sitePublished,
      eventDate,
      venue,
      dressCode,
      eventType: templateEventType,
      heroImageUrl,
      heroVideoUrl,
      galleryImageUrls,
      galleryVideoUrls,
      sections: templateSections,
      rsvpFlow,
      guestExperience,
      title,
      subject,
      message,
      channels,
      sendNow,
      scheduledAt,
    }),
    [
      resolvedTemplateId,
      selectedAudience,
      siteSlug,
      sitePublished,
      eventDate,
      venue,
      dressCode,
      templateEventType,
      heroImageUrl,
      heroVideoUrl,
      galleryImageUrls,
      galleryVideoUrls,
      templateSections,
      rsvpFlow,
      guestExperience,
      title,
      subject,
      message,
      channels,
      sendNow,
      scheduledAt,
    ],
  );
  const composerSnapshotKey = useMemo(
    () =>
      JSON.stringify({
        ...composerSnapshot,
        channels: [...composerSnapshot.channels].sort(),
      }),
    [composerSnapshot],
  );
  const baselineSnapshotKey = baselineSnapshotRef.current
    ? JSON.stringify({
        ...baselineSnapshotRef.current,
        channels: [...baselineSnapshotRef.current.channels].sort(),
      })
    : null;
  const isDirty = baselineSnapshotKey != null && baselineSnapshotKey !== composerSnapshotKey;
  const draftStorageKey = `${INVITE_DRAFT_STORAGE_PREFIX}${eventId}`;
  const guestSitePreviewUrl = `/invite/${siteSlug}`;

  const fieldErrors = useMemo(() => {
    if (!showValidation) return {};
    const errors: Partial<
      Record<
        "title" | "eventDate" | "venue" | "dressCode" | "subject" | "message" | "channels" | "scheduledAt",
        string
      >
    > = {};
    if (!composeValidation.success) {
      for (const issue of composeValidation.error.issues) {
        const key = issue.path[0];
        if (
          key === "title" ||
          key === "eventDate" ||
          key === "venue" ||
          key === "dressCode" ||
          key === "subject" ||
          key === "message" ||
          key === "channels"
        ) {
          errors[key] = issue.message;
        }
      }
    }
    if (!sendValidation.success) {
      for (const issue of sendValidation.error.issues) {
        const key = issue.path[0];
        if (key === "scheduledAt") {
          errors.scheduledAt = issue.message;
        }
      }
    }
    return errors;
  }, [showValidation, composeValidation, sendValidation]);

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }
    if (!baselineSnapshotRef.current) {
      baselineSnapshotRef.current = composerSnapshot;
    }
  }, [isInitialLoading, composerSnapshot]);

  useEffect(() => {
    if (isInitialLoading || hydratedDraft) {
      return;
    }
    const stored = parseStoredComposerSnapshot(window.sessionStorage.getItem(draftStorageKey));
    if (stored) {
      setSelectedTemplateId(stored.templateId);
      setSelectedAudienceId(stored.audienceId);
      setSiteSlug(stored.siteSlug);
      setSitePublished(stored.sitePublished);
      setSiteSlugTouched(true);
      setEventDate(stored.eventDate);
      setVenue(stored.venue);
      setDressCode(stored.dressCode);
      setTemplateEventType(stored.eventType);
      setHeroImageUrl(stored.heroImageUrl);
      setHeroVideoUrl(stored.heroVideoUrl);
      setGalleryImageUrls(stored.galleryImageUrls);
      setGalleryVideoUrls(stored.galleryVideoUrls);
      setTemplateSections(stored.sections);
      setRsvpFlow(stored.rsvpFlow);
      setGuestExperience(stored.guestExperience);
      setTitle(stored.title);
      setSubject(stored.subject);
      setMessage(stored.message);
      setChannels(stored.channels.length > 0 ? stored.channels : [...DEFAULT_CHANNELS]);
      setSendNow(stored.sendNow);
      setScheduledAt(stored.scheduledAt);
      toast.message("Recovered local draft", {
        description: "Unsaved invite changes were restored from this browser session.",
      });
    }
    setHydratedDraft(true);
  }, [isInitialLoading, hydratedDraft, draftStorageKey]);

  useEffect(() => {
    if (siteSlugTouched) return;
    setSiteSlug(toInviteSlug(title || subject));
  }, [title, subject, siteSlugTouched]);

  useEffect(() => {
    if (!hydratedDraft) return;
    if (isDirty) {
      window.sessionStorage.setItem(draftStorageKey, JSON.stringify(composerSnapshot));
      return;
    }
    window.sessionStorage.removeItem(draftStorageKey);
  }, [hydratedDraft, isDirty, draftStorageKey, composerSnapshot]);

  useEffect(() => {
    if (!isDirty) return;

    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (target.target === "_blank") return;
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      ) {
        return;
      }
      const next = new URL(target.href, window.location.href);
      const samePath =
        next.pathname === window.location.pathname &&
        next.search === window.location.search &&
        next.hash === window.location.hash;
      if (samePath) return;
      const shouldLeave = window.confirm(LEAVE_CONFIRM_MSG);
      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [isDirty]);

  async function handleSaveDraft() {
    setShowValidation(true);
    if (!composeValidation.success) {
      toast.error("Invalid invite", {
        description:
          composeValidation.error.issues[0]?.message ?? "Please review your invite details.",
      });
      return;
    }
    await createCampaign.mutateAsync(toCreateInviteCampaignBody(composeValidation.data));
    baselineSnapshotRef.current = composerSnapshot;
    window.sessionStorage.removeItem(draftStorageKey);
    setShowValidation(false);
  }

  async function handleSendInvite() {
    setShowValidation(true);
    if (!composeValidation.success) {
      toast.error("Unable to send invite", {
        description:
          composeValidation.error.issues[0]?.message ?? "Please review your invite details.",
      });
      return;
    }
    if (!sendValidation.success) {
      toast.error("Unable to send invite", {
        description: sendValidation.error.issues[0]?.message ?? "Please try again.",
      });
      return;
    }
    const draft = await createCampaign.mutateAsync(
      toCreateInviteCampaignBody(composeValidation.data),
    );
    await sendCampaign.mutateAsync({
      campaignId: draft.campaign.id,
      body: {
        sendNow: sendValidation.data.sendNow,
        scheduledAt: sendValidation.data.scheduledAt,
        channels: sendValidation.data.channels,
      },
    });
    baselineSnapshotRef.current = composerSnapshot;
    window.sessionStorage.removeItem(draftStorageKey);
    setShowValidation(false);
  }

  async function handleSendExistingCampaign(campaign: InviteCampaignRow) {
    const sendParsed = inviteSendSchema.safeParse({
      campaignId: campaign.id,
      sendNow: true,
      channels: campaign.channels,
    });
    if (!sendParsed.success) {
      toast.error("Unable to send invite", {
        description: sendParsed.error.issues[0]?.message ?? "Please try again.",
      });
      return;
    }
    setSendingCampaignId(campaign.id);
    try {
      await sendCampaign.mutateAsync({
        campaignId: sendParsed.data.campaignId,
        body: {
          sendNow: sendParsed.data.sendNow,
          channels: sendParsed.data.channels,
        },
      });
    } finally {
      setSendingCampaignId(undefined);
    }
  }

  function applyTemplate(templateId?: string) {
    const template = templateId ? templates.find((t) => t.id === templateId) : undefined;
    if (!template) {
      return;
    }
    setTitle(template.name);
    setSubject(template.subject);
    setMessage(template.body);
    setChannels(template.channels.length > 0 ? [...template.channels] : [...DEFAULT_CHANNELS]);
  }

  function handleTemplateChange(templateId: string) {
    const nextTemplateId = templateId || undefined;
    setSelectedTemplateId(nextTemplateId);
    applyTemplate(nextTemplateId);
  }

  function handleSiteSlugChange(value: string) {
    setSiteSlugTouched(true);
    setSiteSlug(toInviteSlug(value));
  }

  function validateSiteSlug(value: string): string | null {
    if (!value || value.length < 3) {
      return "Slug must be at least 3 characters.";
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return "Use lowercase letters, numbers, and hyphens only.";
    }
    return null;
  }

  async function handleSaveSiteSettings() {
    const slugError = validateSiteSlug(siteSlug);
    if (slugError) {
      toast.error("Invalid slug", { description: slugError });
      return;
    }
    if (!templateWebsiteValidation.success) {
      toast.error("Invalid website settings", {
        description:
          templateWebsiteValidation.error.issues[0]?.message ?? "Review website settings and try again.",
      });
      return;
    }
    const result = await upsertInviteSite.mutateAsync({
      eventId,
      slug: siteSlug,
      templateId: resolvedTemplateId,
      published: sitePublished,
      title,
      subject,
      message,
      eventDate,
      venue,
      dressCode,
      eventType: templateEventType,
      rsvpFlow,
      guestExperience,
      heroImageUrl,
      heroVideoUrl,
      galleryImageUrls,
      galleryVideoUrls,
      sections: templateSections,
    });
    setSitePublished(result.published);
  }

  async function handlePublishSite(nextPublished: boolean) {
    const slugError = validateSiteSlug(siteSlug);
    if (slugError) {
      toast.error("Invalid slug", { description: slugError });
      return;
    }
    await handleSaveSiteSettings();
    const result = nextPublished
      ? await publishInviteSite.mutateAsync({ slug: siteSlug, eventId })
      : await unpublishInviteSite.mutateAsync({ slug: siteSlug, eventId });
    setSitePublished(result.published);
  }

  function applyEventTypeDefaults(type: TemplateEventType) {
    if (type === "wedding") {
      setTitle("Wedding day invitation");
      setSubject("Together with our families, you are invited");
      setMessage(
        "Please join us as we celebrate our union. Your presence and prayers mean a lot to us.",
      );
      setDressCode("Black tie optional");
      setVenue("The Grand Hall, Lagos");
      return;
    }
    if (type === "birthday") {
      setTitle("Birthday celebration invite");
      setSubject("You are invited to a birthday celebration");
      setMessage(
        "Come celebrate with us for an evening of fun, music, and great company. We would love to see you there.",
      );
      return;
    }
    if (type === "funeral") {
      setTitle("Memorial service notice");
      setSubject("In loving memory - memorial invitation");
      setMessage(
        "With gratitude and love, we invite you to join us as we celebrate a life well lived and share moments of reflection.",
      );
      return;
    }
    setTitle("Corporate event invite");
    setSubject("Invitation: Join our corporate event");
    setMessage(
      "You are invited to attend this professional gathering featuring keynote sessions, networking, and strategic insights.",
    );
  }

  function validateFile(file: File, kind: "image" | "video"): string | null {
    if (kind === "image" && !file.type.startsWith("image/")) {
      return "Please choose a valid image file.";
    }
    if (kind === "video" && !file.type.startsWith("video/")) {
      return "Please choose a valid video file.";
    }
    if (kind === "image" && file.size > MAX_IMAGE_SIZE_BYTES) {
      return "Image is too large. Max size is 10MB.";
    }
    if (kind === "video" && file.size > MAX_VIDEO_SIZE_BYTES) {
      return "Video is too large. Max size is 30MB.";
    }
    return null;
  }

  async function uploadMediaFile(params: {
    file: File;
    kind: "hero-image" | "hero-video" | "gallery-image" | "gallery-video";
    onProgress?: (percentage: number) => void;
  }): Promise<string> {
    const uploaded = await uploadInviteMedia.mutateAsync({
      eventId,
      kind: params.kind,
      file: params.file,
      onProgress: params.onProgress,
    });
    return uploaded.url;
  }

  async function handleHeroImageSelect(file: File | null) {
    setMediaUploadError(null);
    if (!file) {
      setHeroImageUrl(undefined);
      return;
    }
    const fileError = validateFile(file, "image");
    if (fileError) {
      setMediaUploadError(fileError);
      return;
    }
    try {
      setHeroImageUploadProgress(0);
      const uploadedUrl = await uploadMediaFile({
        file,
        kind: "hero-image",
        onProgress: setHeroImageUploadProgress,
      });
      setHeroImageUrl(uploadedUrl);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setMediaUploadError(message);
      toast.error("Hero image upload failed", { description: message });
    } finally {
      setHeroImageUploadProgress(null);
    }
  }

  async function handleHeroVideoSelect(file: File | null) {
    setMediaUploadError(null);
    if (!file) {
      setHeroVideoUrl(undefined);
      return;
    }
    const fileError = validateFile(file, "video");
    if (fileError) {
      setMediaUploadError(fileError);
      return;
    }
    try {
      setHeroVideoUploadProgress(0);
      const uploadedUrl = await uploadMediaFile({
        file,
        kind: "hero-video",
        onProgress: setHeroVideoUploadProgress,
      });
      setHeroVideoUrl(uploadedUrl);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setMediaUploadError(message);
      toast.error("Hero video upload failed", { description: message });
    } finally {
      setHeroVideoUploadProgress(null);
    }
  }

  async function handleGalleryImagesAdd(files: File[]) {
    if (files.length === 0) return;
    setMediaUploadError(null);
    const availableSlots = Math.max(0, 20 - galleryImageUrls.length);
    const queue = files.slice(0, availableSlots);
    if (queue.length === 0) return;
    setGalleryImageUploadCount(queue.length);
    try {
      const uploadedUrls: string[] = [];
      for (const file of queue) {
        const fileError = validateFile(file, "image");
        if (fileError) {
          throw new Error(fileError);
        }
        const uploadedUrl = await uploadMediaFile({ file, kind: "gallery-image" });
        uploadedUrls.push(uploadedUrl);
        setGalleryImageUploadCount((prev) => Math.max(0, prev - 1));
      }
      setGalleryImageUrls((prev) => [...prev, ...uploadedUrls].slice(0, 20));
    } catch (error) {
      const message = getApiErrorMessage(error);
      setMediaUploadError(message);
      toast.error("Gallery image upload failed", { description: message });
    } finally {
      setGalleryImageUploadCount(0);
    }
  }

  async function handleGalleryVideosAdd(files: File[]) {
    if (files.length === 0) return;
    setMediaUploadError(null);
    const availableSlots = Math.max(0, 6 - galleryVideoUrls.length);
    const queue = files.slice(0, availableSlots);
    if (queue.length === 0) return;
    setGalleryVideoUploadCount(queue.length);
    try {
      const uploadedUrls: string[] = [];
      for (const file of queue) {
        const fileError = validateFile(file, "video");
        if (fileError) {
          throw new Error(fileError);
        }
        const uploadedUrl = await uploadMediaFile({ file, kind: "gallery-video" });
        uploadedUrls.push(uploadedUrl);
        setGalleryVideoUploadCount((prev) => Math.max(0, prev - 1));
      }
      setGalleryVideoUrls((prev) => [...prev, ...uploadedUrls].slice(0, 6));
    } catch (error) {
      const message = getApiErrorMessage(error);
      setMediaUploadError(message);
      toast.error("Gallery video upload failed", { description: message });
    } finally {
      setGalleryVideoUploadCount(0);
    }
  }

  function handleGalleryImageRemove(index: number) {
    setGalleryImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleGalleryVideoRemove(index: number) {
    setGalleryVideoUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSectionToggle(section: keyof TemplateSections) {
    setTemplateSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function handleGuestExperienceChange(
    next: Partial<TemplateGuestExperience>,
  ) {
    setGuestExperience((prev) => ({ ...prev, ...next }));
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex min-h-14 shrink-0 flex-col gap-3 border-b border-evvnt-n200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-0">
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/events">Events</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>E-Invites</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <button
          type="button"
          onClick={() => void handleSendInvite()}
          disabled={!canSendNow}
          className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-evvnt-md bg-evvnt-core px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-evvnt-deep sm:self-auto"
        >
          <Send className="size-[13px]" strokeWidth={1.7} />
          {sendCampaign.isPending ? "Sending..." : sendNow ? "Send now" : "Schedule send"}
        </button>
        <span
          className={
            isDirty
              ? "inline-flex items-center rounded-full border border-evvnt-warn-light bg-evvnt-warn-subtle px-2.5 py-1 text-[10px] font-semibold text-evvnt-warn"
              : "inline-flex items-center rounded-full border border-evvnt-success-light bg-evvnt-success-subtle px-2.5 py-1 text-[10px] font-semibold text-evvnt-success"
          }
        >
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-evvnt-mist px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto flex w-full max-w-[min(100%,1400px)] flex-col gap-5 sm:gap-6">
          {firstError ? (
            <div
              className="rounded-evvnt-xl border border-evvnt-danger-light bg-evvnt-danger-subtle px-4 py-3 text-sm text-evvnt-danger"
              role="alert"
            >
              {getApiErrorMessage(firstError)}
            </div>
          ) : null}
          {isInitialLoading ? (
            <EInvitesPageSkeleton />
          ) : (
            <>
              <InviteKpis items={kpis} />

              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <InviteComposer
                  templates={templates.map((template: InviteTemplateRow) => ({
                    id: template.id,
                    name: template.name,
                  }))}
                  selectedTemplateId={resolvedTemplateId}
                  title={title}
                  eventDate={eventDate}
                  venue={venue}
                  dressCode={dressCode}
                  subject={subject}
                  message={message}
                  channels={channels}
                  sendNow={sendNow}
                  scheduledAt={scheduledAt}
                  onTemplateChange={handleTemplateChange}
                  onTitleChange={setTitle}
                  onEventDateChange={setEventDate}
                  onVenueChange={setVenue}
                  onDressCodeChange={setDressCode}
                  onSubjectChange={setSubject}
                  onMessageChange={setMessage}
                  onToggleChannel={(channel) =>
                    setChannels((prev) =>
                      prev.includes(channel)
                        ? prev.filter((c) => c !== channel)
                        : [...prev, channel],
                    )
                  }
                  onSendNowChange={setSendNow}
                  onScheduledAtChange={setScheduledAt}
                  onResetFromTemplate={() => applyTemplate(resolvedTemplateId)}
                  fieldErrors={fieldErrors}
                  onSaveDraft={() => void handleSaveDraft()}
                  onSendInvite={() => void handleSendInvite()}
                  saveDisabled={saveOrSendBusy}
                  sendDisabled={saveOrSendBusy}
                />
                <InviteAudiencePanel
                  audiences={audiences}
                  selectedAudienceId={selectedAudience}
                  onSelectAudience={setSelectedAudienceId}
                />
              </div>

              <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white p-4 shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-[13px] font-semibold tracking-tight text-evvnt-ink">
                      Template website editor
                    </h2>
                    <p className="mt-0.5 text-[11px] text-evvnt-n500">
                      Fullscreen builder with animated preview, RSVP flow, and shared album controls.
                    </p>
                  </div>
                  <Dialog open={templateEditorOpen} onOpenChange={setTemplateEditorOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Open fullscreen editor
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      showClose
                      className="!left-0 !top-0 !grid !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0"
                    >
                      <div className="flex min-h-0 flex-1 flex-col bg-evvnt-mist">
                        <DialogHeader className="shrink-0 border-b border-evvnt-n200 bg-white px-5 py-3 text-left">
                          <DialogTitle className="text-sm">Invite website editor</DialogTitle>
                          <DialogDescription className="text-xs">
                            Clean builder layout: page blocks, RSVP flow, media uploads, and guest-facing
                            shared album options.
                          </DialogDescription>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={
                                sitePublished
                                  ? "inline-flex items-center rounded-full border border-evvnt-success-light bg-evvnt-success-subtle px-2 py-0.5 text-[10px] font-semibold text-evvnt-success"
                                  : "inline-flex items-center rounded-full border border-evvnt-n200 bg-white px-2 py-0.5 text-[10px] font-semibold text-evvnt-n600"
                              }
                            >
                              {sitePublished ? "Published" : "Draft"}
                            </span>
                            <label className="flex items-center gap-1 text-[10px] text-evvnt-n500">
                              Slug
                              <input
                                value={siteSlug}
                                onChange={(e) => handleSiteSlugChange(e.target.value)}
                                className="h-7 w-52 rounded-evvnt-sm border border-evvnt-n200 bg-white px-2 text-[11px] text-evvnt-ink outline-none"
                              />
                            </label>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 px-2.5 text-[11px]"
                              onClick={() => void handleSaveSiteSettings()}
                              disabled={siteMutationBusy || mediaUploadInFlight}
                            >
                              Save site settings
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-[11px]"
                              onClick={() => void handlePublishSite(!sitePublished)}
                              disabled={siteMutationBusy || mediaUploadInFlight}
                            >
                              {sitePublished ? "Unpublish" : "Publish"}
                            </Button>
                            <a
                              href={guestSitePreviewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-evvnt-sm border border-evvnt-n200 px-2 py-1 text-[11px] font-medium text-evvnt-n600 hover:border-evvnt-muted hover:text-evvnt-core"
                            >
                              Open public guest page
                            </a>
                            <span className="text-[10px] text-evvnt-n400">{guestSitePreviewUrl}</span>
                          </div>
                        </DialogHeader>
                        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
                          <InviteTemplateEditor
                            eventType={templateEventType}
                            rsvpFlow={rsvpFlow}
                            guestExperience={guestExperience}
                            onEventTypeChange={setTemplateEventType}
                            onRsvpFlowChange={setRsvpFlow}
                            onGuestExperienceChange={handleGuestExperienceChange}
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
                            sections={templateSections}
                            onHeroImageSelect={handleHeroImageSelect}
                            onHeroVideoSelect={handleHeroVideoSelect}
                            onGalleryImagesAdd={handleGalleryImagesAdd}
                            onGalleryVideosAdd={handleGalleryVideosAdd}
                            onGalleryImageRemove={handleGalleryImageRemove}
                            onGalleryVideoRemove={handleGalleryVideoRemove}
                            heroImageUploadProgress={heroImageUploadProgress}
                            heroVideoUploadProgress={heroVideoUploadProgress}
                            galleryImageUploadCount={galleryImageUploadCount}
                            galleryVideoUploadCount={galleryVideoUploadCount}
                            mediaUploadError={mediaUploadError}
                            onSectionToggle={handleSectionToggle}
                            onSectionsChange={setTemplateSections}
                            onApplyEventDefaults={applyEventTypeDefaults}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </section>

              <InviteRecentSends
                campaigns={campaigns}
                audiences={audiences}
                onSendCampaign={(campaign) => void handleSendExistingCampaign(campaign)}
                sendingCampaignId={sendingCampaignId}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
