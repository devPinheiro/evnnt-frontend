import type { ReactNode } from "react";

import { CreateEventOverlay } from "./create-event-overlay";

/**
 * Global modal / drawer layer for the authenticated app — mount once next to main content.
 * Add new overlays here as the product grows (same EHR shell pattern).
 */
export function UiOverlays(): ReactNode {
  return (
    <>
      <CreateEventOverlay />
    </>
  );
}
