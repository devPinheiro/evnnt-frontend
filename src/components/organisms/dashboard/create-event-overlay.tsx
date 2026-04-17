import { BaseFormSheet } from "@molecules/forms/base-form-sheet";
import { useUiStore } from "@store";

import { CreateEventForm } from "./create-event-form";

/**
 * Create-event overlay — **Sheet only** (EHR `BaseFormSheet` pattern; no center Dialog).
 * Open/close via `useUiStore` (global), mounted once in `UiOverlays`.
 */
export function CreateEventOverlay() {
  const open = useUiStore((s) => s.createEventOpen);
  const setOpen = useUiStore((s) => s.setCreateEventOpen);

  return (
    <BaseFormSheet
      open={open}
      onOpenChange={setOpen}
      title="Create new event"
      description="Add the basics now — you can refine details, tickets, and guests anytime."
    >
      <CreateEventForm open={open} onDismiss={() => setOpen(false)} />
    </BaseFormSheet>
  );
}
