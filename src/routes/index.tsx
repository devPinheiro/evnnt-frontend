import { LandingPage } from "@pages";
import { createFileRoute, redirect } from "@tanstack/react-router";

/** `/` is always the public landing. Logged-in users go straight to the app; public-dashboard dev mode does not override this. */
export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: LandingPage,
});
