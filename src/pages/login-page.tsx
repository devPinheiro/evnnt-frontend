import { getApiErrorMessage } from "@/lib/api-error";
import { useLogin } from "@/services/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormValues } from "@schemas/auth.schemas";
import { loginSchema } from "@schemas/auth.schemas";
import { useAuthStore } from "@store";
import { Link, useRouter } from "@tanstack/react-router";
import { AuthLayout } from "@templates/auth-layout";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Input } from "@ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      orgId: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const orgId = values.orgId.trim();
    try {
      const data = await login.mutateAsync({
        orgId,
        email: values.email.trim(),
        password: values.password,
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
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full border-evvnt-n200 shadow-[0_4px_24px_-4px_rgb(26_9_51_/_10%)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <CardHeader className="space-y-1.5 p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-evvnt-ink">Sign in</CardTitle>
              <p className="text-sm leading-relaxed text-evvnt-n500">
                Use your organisation ID, email, and password to access your workspace.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 pb-6">
              <FormField
                control={form.control}
                name="orgId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation ID</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="organization" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={form.formState.isSubmitting || login.isPending}
                className="mt-1 w-full py-2.5"
              >
                {form.formState.isSubmitting || login.isPending ? "Signing in…" : "Sign in"}
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
        </Form>
      </Card>
    </AuthLayout>
  );
}
