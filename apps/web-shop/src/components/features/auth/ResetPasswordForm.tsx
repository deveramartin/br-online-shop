"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/api-client";
import { FormField } from "@/components/ui/FormField";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
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
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Set New Password</h1>
          <p className="text-sm text-[var(--muted)]">Please enter a new password for your account.</p>
        </div>

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="New Password" error={errors.password?.message} htmlFor="reset-password">
              <input
                id="reset-password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
                {...register("password")}
              />
            </FormField>

            <FormField label="Confirm New Password" error={errors.confirmPassword?.message} htmlFor="reset-confirm">
              <input
                id="reset-confirm"
                type="password"
                placeholder="••••••••"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
                {...register("confirmPassword")}
              />
            </FormField>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary)] text-white font-semibold py-3.5 rounded-full hover:bg-[var(--primary-dark)] active:scale-[0.98] transition-all shadow-md mt-4 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Resetting Password..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
