"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { FormField } from "@/components/ui/FormField";

export function LoginForm() {
  const router = Router();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md">
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Bren Raphael&apos;s</h1>
          <p className="text-sm text-[var(--muted)]">Welcome back! Please login to your account.</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error-container)] text-[var(--on-error-container)] text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email Address" error={errors.email?.message} htmlFor="login-email">
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
              {...register("email")}
            />
          </FormField>

          <FormField error={errors.password?.message} htmlFor="login-password">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="login-password" className="text-sm font-medium text-[var(--muted)]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-base"
              {...register("password")}
            />
          </FormField>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--primary)] text-white font-semibold py-3.5 rounded-full hover:bg-[var(--primary-dark)] active:scale-[0.98] transition-all shadow-md mt-4 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--primary)] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Router() {
  return useRouter();
}
