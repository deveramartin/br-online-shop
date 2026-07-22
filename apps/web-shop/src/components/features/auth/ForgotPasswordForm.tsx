"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/api-client";
import { FormField } from "@/components/ui/FormField";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setIsSuccess(true);
    } catch {
      // Still show success for security
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md">
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Reset Password</h1>
          <p className="text-sm text-[var(--muted)]">
            Enter your account&apos;s email address and we&apos;ll send you password reset instructions.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-lg bg-[var(--surface-container)] text-[var(--primary)] text-sm font-medium">
              If an account exists with that email address, password reset instructions have been sent.
            </div>
            <Link
              href="/signin"
              className="inline-block mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              ← Back to Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email Address" error={errors.email?.message} htmlFor="forgot-email">
              <input
                id="forgot-email"
                type="email"
                placeholder="name@example.com"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
                {...register("email")}
              />
            </FormField>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary)] text-white font-semibold py-3.5 rounded-full hover:bg-[var(--primary-dark)] active:scale-[0.98] transition-all shadow-md mt-4 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </button>

            <div className="text-center pt-4">
              <Link href="/signin" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                ← Back to Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
