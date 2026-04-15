import type { ReactNode } from "react";

import { AuthWordmark } from "@molecules/auth/AuthWordmark";

type AuthLayoutProps = {
  children: ReactNode;
  /** Show evvnt wordmark above the card (default true). */
  showWordmark?: boolean;
};

/**
 * Centered auth shell on Evvnt mist + soft radial accents — same family as the dashboard chrome.
 */
export function AuthLayout({ children, showWordmark = true }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-evvnt-mist">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(124_58_237_/_18%)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(75_31_168_/_12%)_0%,transparent_68%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        {showWordmark && <AuthWordmark />}
        {children}
      </div>
    </div>
  );
}
