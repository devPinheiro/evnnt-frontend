import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";

export type RouterAuthContext = {
  isLoggedIn: boolean;
};

export const Route = createRootRouteWithContext<{ auth: RouterAuthContext }>()({
  component: RootLayout,
});

function RootLayout(): ReactNode {
  return (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
