import { getApiErrorMessage } from "@/lib/api-error";
import { login as loginApi } from "@/services/auth.api";
import { useAuthStore } from "@store";
import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { AuthLayout } from "@templates/auth-layout";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/events", replace: true });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [orgId, setOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({
        orgId: orgId.trim(),
        email: email.trim(),
        password,
      });
      setSession({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        orgId,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name ?? null,
        },
      });
      toast.success("Signed in");
      await router.navigate({ to: "/events" });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full border-evvnt-n200 shadow-[0_4px_24px_-4px_rgb(26_9_51_/_10%)]">
        <form onSubmit={onSubmit} className="flex flex-col">
          <CardHeader className="space-y-1.5 p-6 pb-4">
            <CardTitle className="text-xl font-semibold text-evvnt-ink">Sign in</CardTitle>
            <p className="text-sm leading-relaxed text-evvnt-n500">
              Use your organisation ID, email, and password to access your workspace.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 pb-6">
            <div className="space-y-1.5">
              <Label htmlFor="login-org">Organisation ID</Label>
              <Input
                id="login-org"
                name="orgId"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                autoComplete="organization"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                minLength={8}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="mt-1 w-full py-2.5"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-center text-sm text-evvnt-n500">
              <Link
                to="/signup"
                className="font-medium text-evvnt-core underline-offset-4 hover:text-evvnt-deep hover:underline"
              >
                Create an organisation
              </Link>
            </p>
          </CardContent>
        </form>
      </Card>
    </AuthLayout>
  );
}
