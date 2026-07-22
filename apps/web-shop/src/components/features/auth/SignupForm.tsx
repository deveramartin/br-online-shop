"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/api-client";
import { FormField } from "@/components/ui/FormField";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/signin");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      const apiErr = err as { status?: number; data?: { detail?: string } };
      if (apiErr?.status === 409) {
        setServerError("This email address is already registered. Please sign in instead.");
      } else {
        setServerError(apiErr?.data?.detail || "Failed to create account. Please check your details and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-lg">
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Bren Raphael&apos;s</h1>
          <p className="text-sm text-[var(--muted)]">
            Join our family and experience traditional Filipino sweets.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error-container)] text-[var(--on-error-container)] text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" error={errors.fullName?.message} htmlFor="signup-name">
            <input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
              {...register("fullName")}
            />
          </FormField>

          <FormField label="Email Address" error={errors.email?.message} htmlFor="signup-email">
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
              {...register("email")}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Password" error={errors.password?.message} htmlFor="signup-password">
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
                {...register("password")}
              />
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message} htmlFor="signup-confirm">
              <input
                id="signup-confirm"
                type="password"
                placeholder="••••••••"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
                {...register("confirmPassword")}
              />
            </FormField>
          </div>

          <div className="flex items-start gap-3 py-2">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
              {...register("terms")}
            />
            <label htmlFor="terms" className="text-xs text-[var(--muted)] leading-tight cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-[var(--primary)] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[var(--primary)] hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.terms && <p className="text-xs text-[var(--error)]">{errors.terms.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--primary)] text-white font-semibold py-3.5 rounded-full hover:bg-[var(--primary-dark)] active:scale-[0.98] transition-all shadow-md mt-4 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href="/signin" className="text-[var(--primary)] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
