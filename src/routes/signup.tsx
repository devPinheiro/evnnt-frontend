import { getApiErrorMessage } from "@/lib/api-error";
import { signup as signupApi } from "@/services/auth.api";
import { useAuthStore } from "@store";
import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { AuthLayout } from "@templates/auth-layout";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/events", replace: true });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [orgName, setOrgName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signupApi({
        orgName: orgName.trim(),
        email: email.trim(),
        password,
        name: name.trim() || undefined,
      });
      setSession({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        orgId: data.organisation.id,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name ?? null,
        },
      });
      toast.success("Account created — verify your email to sign in with password later.");
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
            <CardTitle className="text-xl font-semibold text-evvnt-ink">
              Create organisation
            </CardTitle>
            <p className="text-sm leading-relaxed text-evvnt-n500">
              Set up your workspace and admin account. You can invite your team later.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 pb-6">
            <div className="space-y-1.5">
              <Label htmlFor="signup-org">Organisation name</Label>
              <Input
                id="signup-org"
                name="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                autoComplete="organization"
                minLength={2}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-name">Your name (optional)</Label>
              <Input
                id="signup-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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
              {loading ? "Creating…" : "Create account"}
            </Button>
            <p className="text-center text-sm text-evvnt-n500">
              <Link
                to="/login"
                className="font-medium text-evvnt-core underline-offset-4 hover:text-evvnt-deep hover:underline"
              >
                Already have an account? Sign in
              </Link>
            </p>
          </CardContent>
        </form>
      </Card>
    </AuthLayout>
  );
}
