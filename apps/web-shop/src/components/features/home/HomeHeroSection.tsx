import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:py-20 bg-[var(--surface-container-lowest)]">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-container)]/20 text-[var(--primary)] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            Traditional Filipino Craftsmanship
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
            A Taste of Heritage, <span className="text-[var(--primary)] block sm:inline">A Spoonful of Love</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            Discover the velvety-smooth, rich purple flavor of our artisanal Ube Halaya. Made from premium purple yams and family-guarded recipes passed down through generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <Button asChild size="lg" className="rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-md px-8 py-6 text-base">
              <Link href="/catalog" className="flex items-center gap-2">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-[var(--border)] text-[var(--primary)] px-8 py-6 text-base">
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-full blur-3xl scale-110 animate-pulse" />
            <img
              src="/logo.jpeg"
              alt="Bren Raphael's Logo"
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl rounded-3xl"
            />
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--secondary-container)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 -right-12 w-48 h-48 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
