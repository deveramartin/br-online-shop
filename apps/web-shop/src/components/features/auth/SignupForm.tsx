"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
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
      <Card className="border border-border/70 shadow-xl rounded-2xl bg-surface-card overflow-hidden">
        <CardHeader className="flex flex-col items-center text-center">
          <Image
            src="/logo.jpeg"
            alt="Bren Raphael's Logo"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover shadow-sm mb-4"
          />
          <CardTitle className="text-3xl font-bold text-[var(--primary)] mb-2">Bren Raphael&apos;s</CardTitle>
          <CardDescription className="text-sm text-[var(--muted)]">
            Join our family and experience traditional Filipino sweets.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="mb-6 p-4 rounded-lg bg-[var(--error-container)] text-[var(--on-error-container)] text-sm">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input id="signup-name" type="text" placeholder="John Doe" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input id="signup-email" type="email" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input id="signup-password" type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input id="signup-confirm" type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <input
                        id="terms"
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="terms" className="text-xs text-[var(--muted)] leading-tight cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[var(--primary)] hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-md mt-4 cursor-pointer"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center border-t pt-6">
          <p className="text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href="/signin" className="text-[var(--primary)] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
