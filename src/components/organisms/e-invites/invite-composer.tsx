import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/sheet";
import { CalendarDays, Mail, MapPin, Send, Shirt } from "lucide-react";
import { useMemo, useState } from "react";

type InviteComposerProps = {
  templates: Array<{ id: string; name: string }>;
  selectedTemplateId?: string;
  title: string;
  eventDate: string;
  venue: string;
  dressCode: string;
  subject: string;
  message: string;
  channels: Array<"email" | "whatsapp">;
  sendNow: boolean;
  scheduledAt: string;
  onTemplateChange: (templateId: string) => void;
  onSubjectChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
  onVenueChange: (value: string) => void;
  onDressCodeChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onToggleChannel: (channel: "email" | "whatsapp") => void;
  onSendNowChange: (value: boolean) => void;
  onScheduledAtChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onResetFromTemplate?: () => void;
  fieldErrors?: Partial<
    Record<
      "title" | "eventDate" | "venue" | "dressCode" | "subject" | "message" | "channels" | "scheduledAt",
      string
    >
  >;
  onSaveDraft?: () => void;
  onSendInvite?: () => void;
  saveDisabled?: boolean;
  sendDisabled?: boolean;
};

export function InviteComposer({
  templates,
  selectedTemplateId,
  title,
  eventDate,
  venue,
  dressCode,
  subject,
  message,
  channels,
  sendNow,
  scheduledAt,
  onTemplateChange,
  onSubjectChange,
  onEventDateChange,
  onVenueChange,
  onDressCodeChange,
  onMessageChange,
  onToggleChannel,
  onSendNowChange,
  onScheduledAtChange,
  onTitleChange,
  onResetFromTemplate,
  fieldErrors,
  onSaveDraft,
  onSendInvite,
  saveDisabled,
  sendDisabled,
}: InviteComposerProps) {
  const [open, setOpen] = useState(false);
  const disabled = saveDisabled || sendDisabled;
  const summary = useMemo(
    () => ({
      eventDate: eventDate || "No date set",
      venue: venue || "No venue set",
      dressCode: dressCode || "No dress code set",
    }),
    [dressCode, eventDate, venue],
  );

  return (
    <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
      <div className="border-b border-evvnt-n100 px-4 py-3.5">
        <h2 className="text-[13px] font-semibold tracking-tight text-evvnt-ink">Compose invite</h2>
        <p className="mt-0.5 text-[11px] text-evvnt-n500">
          Sheet form with complete event details
        </p>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-2.5 py-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              <CalendarDays className="size-3" />
              Event date
            </div>
            <p className="mt-1 text-[12px] font-medium text-evvnt-ink">{summary.eventDate}</p>
          </div>
          <div className="rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-2.5 py-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              <MapPin className="size-3" />
              Venue
            </div>
            <p className="mt-1 truncate text-[12px] font-medium text-evvnt-ink">{summary.venue}</p>
          </div>
          <div className="rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-2.5 py-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
              <Shirt className="size-3" />
              Dress code
            </div>
            <p className="mt-1 truncate text-[12px] font-medium text-evvnt-ink">{summary.dressCode}</p>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center rounded-evvnt-md border border-evvnt-muted bg-evvnt-tint px-3 py-2 text-xs font-semibold text-evvnt-core hover:bg-white"
            >
              Open compose sheet
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-[560px]">
            <SheetHeader className="shrink-0 text-left">
              <SheetTitle>Compose invite sheet</SheetTitle>
              <SheetDescription>
                Fill campaign, event, and delivery details in one place.
              </SheetDescription>
            </SheetHeader>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Template
                </span>
                <select
                  value={selectedTemplateId ?? ""}
                  onChange={(e) => onTemplateChange(e.target.value)}
                  disabled={disabled || templates.length === 0}
                  className="h-10 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-[13px] text-evvnt-ink outline-none"
                >
                  <option value="">No template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {selectedTemplateId ? (
                  <button
                    type="button"
                    onClick={onResetFromTemplate}
                    disabled={disabled}
                    className="w-fit text-[11px] font-medium text-evvnt-vivid hover:text-evvnt-core"
                  >
                    Reset title/subject/message from template
                  </button>
                ) : null}
              </label>

              <div className="grid gap-3 rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist p-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                    Date of event
                  </span>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => onEventDateChange(e.target.value)}
                    disabled={disabled}
                    className="h-10 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-[13px] text-evvnt-ink outline-none"
                  />
                  {fieldErrors?.eventDate ? (
                    <span className="text-[11px] text-evvnt-danger">{fieldErrors.eventDate}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                    Venue
                  </span>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => onVenueChange(e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. Civic Centre, Lagos"
                    className="h-10 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-[13px] text-evvnt-ink outline-none"
                  />
                  {fieldErrors?.venue ? (
                    <span className="text-[11px] text-evvnt-danger">{fieldErrors.venue}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                    Dress code
                  </span>
                  <input
                    type="text"
                    value={dressCode}
                    onChange={(e) => onDressCodeChange(e.target.value)}
                    disabled={disabled}
                    placeholder="e.g. Black tie / Traditional attire"
                    className="h-10 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-[13px] text-evvnt-ink outline-none"
                  />
                  {fieldErrors?.dressCode ? (
                    <span className="text-[11px] text-evvnt-danger">{fieldErrors.dressCode}</span>
                  ) : null}
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Campaign title
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  disabled={disabled}
                  className="h-10 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-[13px] text-evvnt-ink outline-none transition-[border,box-shadow] focus:border-evvnt-vivid focus:shadow-[0_0_0_3px_rgb(124_58_237_/_10%)]"
                />
                {fieldErrors?.title ? (
                  <span className="text-[11px] text-evvnt-danger">{fieldErrors.title}</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Subject line
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  disabled={disabled}
                  className="h-10 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-[13px] text-evvnt-ink outline-none transition-[border,box-shadow] focus:border-evvnt-vivid focus:shadow-[0_0_0_3px_rgb(124_58_237_/_10%)]"
                />
                {fieldErrors?.subject ? (
                  <span className="text-[11px] text-evvnt-danger">{fieldErrors.subject}</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Message
                </span>
                <textarea
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  rows={5}
                  disabled={disabled}
                  className="rounded-evvnt-md border border-evvnt-n200 bg-white px-3 py-2.5 text-[13px] text-evvnt-ink outline-none transition-[border,box-shadow] focus:border-evvnt-vivid focus:shadow-[0_0_0_3px_rgb(124_58_237_/_10%)]"
                />
                {fieldErrors?.message ? (
                  <span className="text-[11px] text-evvnt-danger">{fieldErrors.message}</span>
                ) : null}
              </label>
              <div className="space-y-2">
                <div className="text-[10px] font-semibold tracking-wide text-evvnt-n500 uppercase">
                  Channels
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: "email", label: "Email" },
                      { id: "whatsapp", label: "WhatsApp" },
                    ] as const
                  ).map((channel) => {
                    const active = channels.includes(channel.id);
                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => onToggleChannel(channel.id)}
                        disabled={disabled}
                        className={
                          active
                            ? "inline-flex items-center gap-1 rounded-full border border-evvnt-muted bg-evvnt-tint px-3 py-1.5 text-[11px] font-medium text-evvnt-core transition-colors"
                            : "inline-flex items-center gap-1 rounded-full border border-evvnt-n200 bg-white px-3 py-1.5 text-[11px] font-medium text-evvnt-n500 transition-colors hover:border-evvnt-muted"
                        }
                      >
                        <span>{channel.label}</span>
                      </button>
                    );
                  })}
                </div>
                {fieldErrors?.channels ? (
                  <span className="text-[11px] text-evvnt-danger">{fieldErrors.channels}</span>
                ) : null}
              </div>
              <div className="space-y-2 rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist p-2.5">
                <label className="flex items-center gap-2 text-[11px] text-evvnt-n600">
                  <input
                    type="checkbox"
                    checked={!sendNow}
                    onChange={(e) => onSendNowChange(!e.target.checked)}
                    disabled={disabled}
                  />
                  Schedule for later
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => onScheduledAtChange(e.target.value)}
                  disabled={sendNow || disabled}
                  className="h-9 w-full rounded-evvnt-md border border-evvnt-n200 bg-white px-2.5 text-[12px] text-evvnt-ink outline-none"
                />
                {fieldErrors?.scheduledAt ? (
                  <span className="text-[11px] text-evvnt-danger">{fieldErrors.scheduledAt}</span>
                ) : null}
              </div>
            </div>

            <SheetFooter className="shrink-0 border-evvnt-n100 border-t pt-3">
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={saveDisabled}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-evvnt-md border border-evvnt-muted px-3 py-2 text-xs font-medium text-evvnt-core transition-colors hover:bg-evvnt-tint"
              >
                <Mail className="size-3.5" strokeWidth={1.5} />
                {saveDisabled ? "Saving..." : "Save draft"}
              </button>
              <button
                type="button"
                onClick={onSendInvite}
                disabled={sendDisabled}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-evvnt-md bg-evvnt-core px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-evvnt-deep"
              >
                <Send className="size-3.5" strokeWidth={1.5} />
                {sendDisabled ? "Sending..." : sendNow ? "Send invite" : "Schedule invite"}
              </button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-3 py-2">
          <p className="text-[11px] text-evvnt-n600">
            Use the compose sheet to manage invite copy, event details, channels, and scheduling.
          </p>
        </div>
      </div>
    </section>
  );
}
