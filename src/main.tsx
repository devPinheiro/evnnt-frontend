import { SessionBootstrap } from "@/components/SessionBootstrap";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth.store";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./global.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    auth: { isLoggedIn: false },
  },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const isLoggedIn = useAuthStore((s) => Boolean(s.accessToken));
  return (
    <>
      <RouterProvider router={router} context={{ auth: { isLoggedIn } }} />
      <Toaster richColors position="top-center" />
    </>
  );
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
