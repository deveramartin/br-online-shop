import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AuthResponse } from "@/types/auth";
import { apiClient } from "@/lib/api/api-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await apiClient.post<AuthResponse>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if (res?.accessToken) {
            return {
              id: res.user.id,
              name: res.user.fullName,
              email: res.user.email,
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            };
          }
        } catch {
          return null;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      session.accessToken = (token.accessToken as string) || "";
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const authGuestOnlyPaths = ["/signin", "/signup", "/forgot-password", "/reset-password"];
      const isAuthGuestOnlyPath = authGuestOnlyPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

      const publicPaths = ["/", "/catalog", "/about", "/contact", "/terms", "/privacy", "/faq"];
      const isPublicPath = publicPaths.some((p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`)));

      const isApiAuthPath = pathname.startsWith("/api/auth");

      if (auth?.user && isAuthGuestOnlyPath) {
        return Response.redirect(new URL("/", request.url));
      }

      if (isPublicPath || isAuthGuestOnlyPath || isApiAuthPath) {
        return true;
      }

      return !!auth?.user;
    },
  },
});
