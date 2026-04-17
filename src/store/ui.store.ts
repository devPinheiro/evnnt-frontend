import { create } from "zustand";

/**
 * Global UI shell state — mirrors EHR app-shell overlays (modals / drawers opened from anywhere).
 * Mount matching views once in `UiOverlays` inside the authenticated layout.
 */
export type UiState = {
  createEventOpen: boolean;
  openCreateEvent: () => void;
  closeCreateEvent: () => void;
  setCreateEventOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  createEventOpen: false,
  openCreateEvent: () => set({ createEventOpen: true }),
  closeCreateEvent: () => set({ createEventOpen: false }),
  setCreateEventOpen: (createEventOpen) => set({ createEventOpen }),
}));
