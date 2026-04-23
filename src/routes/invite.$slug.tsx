import { InviteGuestSitePage } from "@pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/invite/$slug")({
  component: InvitePublicRoute,
});

function InvitePublicRoute() {
  const { slug } = Route.useParams();
  return <InviteGuestSitePage slug={slug} />;
}
