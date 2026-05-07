import { GuestsPage } from "@pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_appLayout/events/guests")({
  component: GuestsPage,
});
