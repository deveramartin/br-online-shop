"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setServerError("Reset token is missing from the URL. Please request a new link.");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await authApi.resetPassword({ token, newPassword: data.password });
      setIsSuccess(true);
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } };
      setServerError(apiErr?.data?.detail || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md">
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[var(--primary)] mb-2">Set New Password</CardTitle>
          <CardDescription className="text-sm text-[var(--muted)]">
            Please enter a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="mb-6 p-4 rounded-lg bg-[var(--error-container)] text-[var(--on-error-container)] text-sm">
              {serverError}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-lg bg-[var(--surface-container)] text-[var(--primary)] text-sm font-medium">
                Password has been reset successfully! Redirecting you to sign in...
              </div>
              <Link href="/signin" className="inline-block mt-4 text-sm font-semibold text-[var(--primary)] hover:underline">
                Click here if not redirected automatically
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input id="reset-password" type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input id="reset-confirm" type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-md mt-4 cursor-pointer"
                >
                  {isLoading ? "Resetting Password..." : "Update Password"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
