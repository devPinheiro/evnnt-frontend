import { EventPlannerPage } from "@pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_appLayout/events/planner")({
  component: EventPlannerPage,
});
