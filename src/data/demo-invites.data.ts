import type {
  InviteAudienceRow,
  InviteCampaignRow,
  InviteCampaignStatus,
  InviteChannel,
  InviteTemplateRow,
} from "@/services/invites.services";
import type { InviteKpiItem } from "@organisms/e-invites";

const sentChannels: InviteChannel[] = ["email", "whatsapp"];
const sentStatus: InviteCampaignStatus = "sent";

export const demoInviteKpis: InviteKpiItem[] = [
  {
    id: "delivered",
    label: "Delivered today",
    value: "1,560",
    hint: "Across 2 campaigns",
  },
  {
    id: "open-rate",
    label: "Open rate",
    value: "81%",
    hint: "+6% vs last week",
  },
  {
    id: "rsvp-conv",
    label: "RSVP conversions",
    value: "34%",
    hint: "From invite click-throughs",
  },
];

export const demoInviteAudiences: InviteAudienceRow[] = [
  { id: "all", label: "All guests", count: 1420, hint: "Entire event list" },
  { id: "vip", label: "VIP guests", count: 140, hint: "Primary table + sponsors" },
  { id: "pending", label: "Pending RSVP", count: 318, hint: "No response yet" },
];

export const demoInviteTemplates: InviteTemplateRow[] = [
  {
    id: "tpl-main",
    name: "Main wedding invite",
    subject: "You're invited: Okonkwo Wedding",
    body: "You're specially invited to celebrate with us. Tap RSVP to confirm your seat and access full event details.",
    channels: ["email", "whatsapp"],
    updatedAt: "2026-04-20T10:00:00.000Z",
  },
  {
    id: "tpl-vip",
    name: "VIP reminder invite",
    subject: "VIP reminder: Your seat and QR details",
    body: "This is a reminder for VIP guests. Please arrive 30 minutes early with your QR code ready for express check-in.",
    channels: ["email", "whatsapp"],
    updatedAt: "2026-04-20T10:00:00.000Z",
  },
];

export const demoInviteCampaigns: InviteCampaignRow[] = [
  {
    id: "send-1",
    eventId: "evt-okonkwo",
    audienceId: "all",
    templateId: "tpl-main",
    title: "Main wedding invite",
    subject: "You're invited: Okonkwo Wedding",
    message: "Join us for an unforgettable celebration.",
    channels: sentChannels,
    status: sentStatus,
    sentAt: "2026-04-21T10:42:00.000Z",
    createdAt: "2026-04-21T09:58:00.000Z",
    updatedAt: "2026-04-21T10:42:00.000Z",
    stats: { delivered: 1420, opened: 1080, clicked: 482, rsvpConversions: 311 },
  },
  {
    id: "send-2",
    eventId: "evt-okonkwo",
    audienceId: "vip",
    templateId: "tpl-vip",
    title: "VIP reminder invite",
    subject: "Reminder: VIP details inside",
    message: "Your VIP QR and timing details are ready.",
    channels: sentChannels,
    status: sentStatus,
    sentAt: "2026-04-20T18:20:00.000Z",
    createdAt: "2026-04-20T18:05:00.000Z",
    updatedAt: "2026-04-20T18:20:00.000Z",
    stats: { delivered: 140, opened: 127, clicked: 112, rsvpConversions: 88 },
  },
];
