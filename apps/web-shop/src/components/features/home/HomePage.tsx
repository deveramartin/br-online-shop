import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Truck } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[var(--surface-low)] to-[var(--surface)] py-20 md:py-32 border-b border-[var(--border)] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-light)]/10 text-[var(--primary)] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Artisanal Filipino Heritage
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--primary-dark)] leading-tight mb-6">
              Authentic Handmade Ube Jam & Halaya
            </h1>
            <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed mb-8">
              Handcrafted in small batches using 100% real purple yam, rich coconut cream, and time-honored family recipes for an unmatched rich and velvety delight.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Explore Shop <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface-card)] text-[var(--primary)] border border-[var(--border)] font-medium hover:bg-[var(--surface-low)] transition-all"
              >
                Our Recipe Story
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-[2rem] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/30 to-[var(--primary-dark)]/40 p-8 flex flex-col justify-between shadow-xl border border-white/50">
              <div className="flex justify-between items-start">
                <span className="bg-white/90 backdrop-blur-xs text-[var(--primary-dark)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Fresh Batch #042
                </span>
                <span className="text-white/80 font-mono text-xs">Small Batch</span>
              </div>
              <div className="text-center text-white my-auto">
                <div className="text-6xl mb-2">🫐</div>
                <h3 className="text-2xl font-bold">Classic Ube Halaya</h3>
                <p className="text-xs text-white/80 mt-1">Rich, Creamy & Authentic</p>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs text-gray-500 block">Net Wt. 350g</span>
                  <span className="text-lg font-bold text-[var(--primary-dark)]">₱350.00</span>
                </div>
                <button className="px-4 py-1.5 rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                  Pre-order
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-[var(--border)]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-low)]">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--primary-dark)]">100% Real Yam</h4>
              <p className="text-xs text-[var(--muted)]">No artificial flavors, colors, or fillers used.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-low)]">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--primary-dark)]">Small Batch Fresh</h4>
              <p className="text-xs text-[var(--muted)]">Slow-cooked to perfection in fresh weekly batches.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-low)]">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--primary-dark)]">Direct Delivery</h4>
              <p className="text-xs text-[var(--muted)]">Carefully packaged and delivered straight to your door.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
