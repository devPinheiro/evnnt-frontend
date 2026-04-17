import { useZodForm } from "@/hooks/use-zod-form";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSignup } from "@/services/auth.services";
import type { SignupFormValues } from "@schemas/auth.schemas";
import { signupSchema } from "@schemas/auth.schemas";
import { useAuthStore } from "@store";
import { Link, useRouter } from "@tanstack/react-router";
import { AuthLayout } from "@templates/auth-layout";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Input } from "@ui/input";
import { toast } from "@ui/sonner";

export function SignupPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const signup = useSignup();

  const form = useZodForm(signupSchema, {
    defaultValues: {
      orgName: "",
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    try {
      const data = await signup.mutateAsync({
        orgName: values.orgName.trim(),
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim() || undefined,
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
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full border-evvnt-n200 shadow-[0_4px_24px_-4px_rgb(26_9_51_/_10%)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <CardHeader className="space-y-1.5 p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-evvnt-ink">
                Create organisation
              </CardTitle>
              <p className="text-sm leading-relaxed text-evvnt-n500">
                Set up your workspace and admin account. You can invite your team later.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 pb-6">
              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation name</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="organization" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="name" />
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
                      <Input {...field} type="password" autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={form.formState.isSubmitting || signup.isPending}
                className="mt-1 w-full py-2.5"
              >
                {form.formState.isSubmitting || signup.isPending ? "Creating…" : "Create account"}
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
        </Form>
      </Card>
    </AuthLayout>
  );
}
