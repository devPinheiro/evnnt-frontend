import { SignupPage } from "@pages";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: SignupPage,
});
