import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/events", replace: true });
    }
    throw redirect({ to: "/login", replace: true });
  },
});
