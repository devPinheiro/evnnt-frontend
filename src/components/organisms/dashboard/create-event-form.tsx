import { parseDatetimeLocal, toDatetimeLocalString } from "@/lib/datetime-local";
import type { CreateEventBody, EventRow } from "@/services/events.api";
import { COMMON_TIMEZONES } from "@data";
import endpoints from "@endpoints";
import { useFormInstance } from "@hooks";
import { FDateTimePicker, FInput, FSelect, FSwitch, FTextarea } from "@molecules/form-fields";
import { type CreateEventFormValues, createEventFormSchema } from "@schemas/event.schemas";
import { Button } from "@ui/button";
import { Form } from "@ui/form";
import { SheetFooter } from "@ui/sheet";
import { useEffect } from "react";

function defaultStartLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(18, 0, 0, 0);
  return toDatetimeLocalString(d);
}

function getDefaultValues(): CreateEventFormValues {
  return {
    name: "",
    description: "",
    startsAt: defaultStartLocal(),
    endsAt: "",
    timezone: "Africa/Lagos",
    location: "",
    isOnline: false,
  };
}

function toCreateEventBody(values: CreateEventFormValues): CreateEventBody {
  const description = values.description?.trim();
  return {
    name: values.name.trim(),
    ...(description ? { description } : {}),
    startsAt: new Date(values.startsAt).toISOString(),
    endsAt: values.endsAt?.trim() ? new Date(values.endsAt).toISOString() : undefined,
    timezone: values.timezone,
    location: values.isOnline ? undefined : values.location?.trim() || undefined,
    isOnline: values.isOnline,
  };
}

type CreateEventFormProps = {
  /** When the shell is open — reset fields when opening */
  open: boolean;
  onDismiss: () => void;
};

/** Create-event fields — RHF + Zod + `useFormInstance` (EHR-style mutation + toast + cache). */
export function CreateEventForm({ open, onDismiss }: CreateEventFormProps) {
  const { form, handleSubmit, isPending } = useFormInstance<
    typeof createEventFormSchema,
    { event: EventRow },
    CreateEventBody
  >({
    schema: createEventFormSchema,
    urls: [endpoints.events.create],
    queryKey: ["events"],
    successMessage: "Event created",
    defaultValues: getDefaultValues(),
    transformPayload: toCreateEventBody,
    onSuccessClose: onDismiss,
  });

  const isOnline = form.watch("isOnline");
  const startsAtValue = form.watch("startsAt");
  const endMinDate = parseDatetimeLocal(startsAtValue);

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-2 pr-0.5">
          <FInput
            name="name"
            label="Event name"
            placeholder="e.g. The Okonkwo Wedding"
            autoComplete="off"
          />

          <FTextarea
            name="description"
            label="Description"
            placeholder="Optional — what guests should know"
            description="Optional. Shown on your public event page when published."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FDateTimePicker
              name="startsAt"
              label="Starts"
              placeholder="Pick start date and time"
              disablePastDates
            />
            <FDateTimePicker
              name="endsAt"
              label="Ends"
              description="Optional"
              placeholder="Pick end date and time"
              minDate={endMinDate}
            />
          </div>

          <FSelect
            name="timezone"
            label="Timezone"
            options={COMMON_TIMEZONES}
            placeholder="Select timezone"
          />

          <FSwitch
            name="isOnline"
            label="Online event"
            description="No physical venue — link will be added later"
            className="rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist px-4 py-3"
          />

          {!isOnline && (
            <FInput
              name="location"
              label="Venue / address"
              placeholder="e.g. Eko Hotel, Victoria Island, Lagos"
            />
          )}
        </div>

        <SheetFooter className="mt-auto shrink-0 border-t border-evvnt-n200 bg-white pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:min-w-[7rem] sm:w-auto"
            onClick={onDismiss}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full min-w-[9.5rem] sm:w-auto" disabled={isPending}>
            {isPending ? "Creating…" : "Create event"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
