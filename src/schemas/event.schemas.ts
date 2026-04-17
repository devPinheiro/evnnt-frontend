import { z } from "zod";

/** Form values — `startsAt` / `endsAt` use `datetime-local` strings */
export const createEventFormSchema = z
  .object({
    name: z.string().min(2, "Event name must be at least 2 characters"),
    description: z.string().max(2000),
    startsAt: z.string().min(1, "Start date and time is required"),
    endsAt: z.string().optional(),
    timezone: z.string().min(1, "Timezone is required"),
    location: z.string().max(500).optional(),
    isOnline: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.endsAt && data.startsAt) {
      const s = new Date(data.startsAt).getTime();
      const e = new Date(data.endsAt).getTime();
      if (Number.isNaN(s) || Number.isNaN(e)) {
        return;
      }
      if (e <= s) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End must be after start",
          path: ["endsAt"],
        });
      }
    }
  });

export type CreateEventFormValues = z.infer<typeof createEventFormSchema>;
