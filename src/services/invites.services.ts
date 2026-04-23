import {
  type CreateInviteCampaignBody,
  type InviteAudienceRow,
  type InviteCampaignRow,
  type InviteCampaignStatus,
  type InviteChannel,
  type InviteMediaKind,
  type InvitePublicSite,
  type InviteSiteConfigBody,
  type InviteSiteStatus,
  type InviteTemplateRow,
  type InviteUploadedAsset,
  type SendInviteCampaignBody,
  createInviteCampaign,
  getInvitePublicSite,
  publishInviteSite,
  sendInviteCampaign,
  unpublishInviteSite,
  upsertInviteSite,
  uploadInviteMedia,
} from "@/services/invites.api";
import endpoints from "@endpoints";
import { useMutationData, useQueryData } from "@hooks";

export type {
  CreateInviteCampaignBody,
  InviteAudienceRow,
  InviteCampaignStatus,
  InviteCampaignRow,
  InviteChannel,
  InviteMediaKind,
  InvitePublicSite,
  InviteSiteConfigBody,
  InviteSiteStatus,
  InviteTemplateRow,
  InviteUploadedAsset,
  SendInviteCampaignBody,
};

export const inviteQueryKeys = {
  campaigns: (eventId?: string) => ["invites", "campaigns", eventId ?? "all"] as const,
  templates: (eventId?: string) => ["invites", "templates", eventId ?? "all"] as const,
  audiences: (eventId?: string) => ["invites", "audiences", eventId ?? "all"] as const,
  publicSite: (slug?: string) => ["invites", "public-site", slug ?? "unknown"] as const,
};

export const useListInviteCampaigns = (eventId?: string) =>
  useQueryData<{ campaigns: InviteCampaignRow[] }>({
    url: endpoints.invites.campaigns,
    queryKey: inviteQueryKeys.campaigns(eventId),
    params: eventId ? { eventId } : undefined,
  });

export const useListInviteTemplates = (eventId?: string) =>
  useQueryData<{ templates: InviteTemplateRow[] }>({
    url: endpoints.invites.templates,
    queryKey: inviteQueryKeys.templates(eventId),
    params: eventId ? { eventId } : undefined,
  });

export const useListInviteAudiences = (eventId?: string) =>
  useQueryData<{ audiences: InviteAudienceRow[] }>({
    url: endpoints.invites.audiences,
    queryKey: inviteQueryKeys.audiences(eventId),
    params: eventId ? { eventId } : undefined,
  });

export const useInvitePublicSite = (slug?: string) =>
  useQueryData<InvitePublicSite>({
    url: endpoints.invites.publicSite(slug ?? ""),
    queryKey: inviteQueryKeys.publicSite(slug),
    enabled: Boolean(slug),
    options: {
      retry: false,
      queryFn: async () => getInvitePublicSite(slug ?? ""),
    },
  });

export const useCreateInviteCampaign = () =>
  useMutationData<{ campaign: InviteCampaignRow }, CreateInviteCampaignBody>({
    url: endpoints.invites.campaigns,
    queryKeys: [
      inviteQueryKeys.campaigns(),
      inviteQueryKeys.templates(),
      inviteQueryKeys.audiences(),
    ],
    successMessage: "Invite draft saved",
    options: {
      mutationFn: async (payload) => ({ campaign: await createInviteCampaign(payload) }),
    },
  });

export type SendInviteCampaignPayload = {
  campaignId: string;
  body?: SendInviteCampaignBody;
};

export const useSendInviteCampaign = () =>
  useMutationData<{ campaign: InviteCampaignRow }, SendInviteCampaignPayload>({
    url: endpoints.invites.campaigns,
    queryKey: inviteQueryKeys.campaigns(),
    successMessage: "Invite campaign sent",
    options: {
      mutationFn: async (payload) => ({
        campaign: await sendInviteCampaign(payload.campaignId, payload.body),
      }),
    },
  });

export type UploadInviteMediaPayload = {
  eventId: string;
  kind: InviteMediaKind;
  file: File;
  onProgress?: (percentage: number) => void;
};

export const useUploadInviteMedia = () =>
  useMutationData<InviteUploadedAsset, UploadInviteMediaPayload>({
    url: endpoints.invites.uploadMedia,
    method: "postForm",
    skipSuccessToast: true,
    options: {
      mutationFn: async (payload) => uploadInviteMedia(payload),
    },
  });

export const useUpsertInviteSite = () =>
  useMutationData<InviteSiteStatus, InviteSiteConfigBody>({
    url: endpoints.invites.sites,
    queryKeys: [inviteQueryKeys.publicSite()],
    successMessage: "Invite site settings saved",
    options: {
      mutationFn: async (payload) => upsertInviteSite(payload),
    },
  });

export type PublishInviteSitePayload = {
  slug: string;
  eventId: string;
};

export const usePublishInviteSite = () =>
  useMutationData<InviteSiteStatus, PublishInviteSitePayload>({
    url: endpoints.invites.sites,
    successMessage: "Invite site published",
    options: {
      mutationFn: async ({ slug, eventId }) => publishInviteSite(slug, eventId),
    },
  });

export const useUnpublishInviteSite = () =>
  useMutationData<InviteSiteStatus, PublishInviteSitePayload>({
    url: endpoints.invites.sites,
    successMessage: "Invite site unpublished",
    options: {
      mutationFn: async ({ slug, eventId }) => unpublishInviteSite(slug, eventId),
    },
  });
