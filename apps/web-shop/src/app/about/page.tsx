import { HomeBrandStory } from "@/components/features/home/HomeBrandStory";
import { HomeTrustBadges } from "@/components/features/home/HomeTrustBadges";

export const metadata = {
  title: "About Us | Bren Raphael's Ube Jam & Halaya",
  description: "Learn about the rich heritage, traditional recipe, and artisanal quality of Bren Raphael's Ube Jam & Halaya.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen py-10 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-widest block">
          Our Heritage &amp; Craft
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
          About Bren Raphael&apos;s
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto">
          Handcrafting the finest 100% pure Filipino purple yam preserves since 1985.
        </p>
      </div>

      <HomeBrandStory />
      <HomeTrustBadges />
    </main>
  );
}
