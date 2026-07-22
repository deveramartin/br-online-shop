import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--surface-container-low)] to-[var(--background)] py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider">
            <span>✨ Authentic Filipino Heritage</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--foreground)] tracking-tight leading-[1.1]">
            Handcrafted <span className="text-[var(--primary)] font-serif italic">Artisanal</span> Ube Jam &amp; Halaya
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            Made with 100% pure real purple yam, slow-cooked to velvety perfection using traditional family recipes passed down through generations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Button asChild size="lg" className="rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-lg hover:shadow-xl transition-all">
              <Link href="/products">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Fresh Catalog
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-full border-[var(--border)] hover:bg-[var(--surface-low)]">
              <Link href="/about">
                Our Heritage Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-full blur-3xl scale-110 animate-pulse" />
            <Image
              src="/logo.jpeg"
              alt="Bren Raphael's Logo"
              width={384}
              height={384}
              priority
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
