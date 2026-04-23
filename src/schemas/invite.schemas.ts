import { z } from "zod";

export const inviteChannelSchema = z.enum(["email", "whatsapp"]);
export const templateEventTypeSchema = z.enum(["wedding", "birthday", "funeral", "corporate"]);
export const templateRsvpFlowSchema = z.enum(["simple", "detailed", "household"]);

export const inviteComposeSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  title: z.string().min(2, "Campaign title is required"),
  templateId: z.string().optional(),
  audienceId: z.string().min(1, "Audience segment is required"),
  eventDate: z.string().min(1, "Event date is required"),
  venue: z.string().min(2, "Venue is required").max(180, "Venue is too long"),
  dressCode: z.string().max(120, "Dress code is too long").optional(),
  subject: z.string().min(2, "Subject is required").max(180, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message should be at least 10 characters")
    .max(4000, "Message is too long"),
  channels: z.array(inviteChannelSchema).min(1, "Select at least one channel"),
  scheduledAt: z.string().optional(),
});

export const inviteSendSchema = z
  .object({
    campaignId: z.string().min(1, "Campaign id is required"),
    sendNow: z.boolean().default(true),
    scheduledAt: z.string().optional(),
    channels: z.array(inviteChannelSchema).min(1, "Select at least one channel").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sendNow) return;
    if (!data.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Schedule time is required when send now is disabled",
        path: ["scheduledAt"],
      });
      return;
    }
    const scheduledMs = new Date(data.scheduledAt).getTime();
    if (Number.isNaN(scheduledMs)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Schedule time is invalid",
        path: ["scheduledAt"],
      });
    }
  });

export const inviteTemplateWebsiteSchema = z.object({
  eventType: templateEventTypeSchema,
  rsvpFlow: templateRsvpFlowSchema,
  heroImageUrl: z.string().url().optional(),
  heroVideoUrl: z.string().url().optional(),
  galleryImageUrls: z.array(z.string().url()).max(20, "Maximum of 20 gallery images"),
  galleryVideoUrls: z.array(z.string().url()).max(6, "Maximum of 6 gallery videos"),
  sections: z.object({
    hero: z.boolean(),
    story: z.boolean(),
    schedule: z.boolean(),
    travel: z.boolean(),
    registry: z.boolean(),
    gallery: z.boolean(),
    rsvp: z.boolean(),
    faq: z.boolean(),
    map: z.boolean(),
  }),
  guestExperience: z.object({
    guestAppEnabled: z.boolean(),
    sharedAlbumEnabled: z.boolean(),
    allowGuestUploads: z.boolean(),
  }),
});

export type InviteComposeValues = z.infer<typeof inviteComposeSchema>;
export type InviteSendValues = z.infer<typeof inviteSendSchema>;
export type InviteTemplateWebsiteValues = z.infer<typeof inviteTemplateWebsiteSchema>;
