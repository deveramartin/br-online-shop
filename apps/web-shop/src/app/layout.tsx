import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Providers } from "@/components/shared/Providers";
import { ChatBubble } from "@/components/features/chat/ChatBubble";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Bren Raphael's Ube Jam & Halaya Shop",
    template: "%s | Bren Raphael's Ube Jam & Halaya",
  },
  description: "Authentic artisanal Filipino Ube Jam & Halaya handcrafted with 100% real purple yam.",
  openGraph: {
    title: "Bren Raphael's Ube Jam & Halaya Shop",
    description: "Authentic artisanal Filipino Ube Jam & Halaya handcrafted with 100% real purple yam.",
    url: "https://brenraphaelubejam.com",
    siteName: "Bren Raphael's Ube Jam & Halaya",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bren Raphael's Ube Jam & Halaya Shop",
    description: "Authentic artisanal Filipino Ube Jam & Halaya handcrafted with 100% real purple yam.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatBubble />
        </Providers>
      </body>
    </html>
  );
}
