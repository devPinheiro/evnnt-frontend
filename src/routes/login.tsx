import { LoginPage } from "@pages";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: LoginPage,
});
