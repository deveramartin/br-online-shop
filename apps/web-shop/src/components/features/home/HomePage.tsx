"use client";

import { HomeHeroSection } from "./HomeHeroSection";
import { HomeTrustBadges } from "./HomeTrustBadges";
import { HomeSignatureCollection } from "./HomeSignatureCollection";
import { HomeBrandStory } from "./HomeBrandStory";
import { HomeTestimonials } from "./HomeTestimonials";
import { HomeFaqSection } from "./HomeFaqSection";
import { HomeNewsletter } from "./HomeNewsletter";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <HomeHeroSection />
      <HomeTrustBadges />
      <HomeSignatureCollection />
      <HomeBrandStory />
      <HomeTestimonials />
      <HomeFaqSection />
      <HomeNewsletter />
    </div>
  );
}
