import { Heart, ShieldCheck, Truck } from "lucide-react";

export function HomeTrustBadges() {
  return (
    <section className="py-8 bg-white border-y border-[var(--border)]/40">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--surface-container-low)]">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--foreground)]">100% Real Yam</h4>
            <p className="text-xs text-[var(--muted)]">No artificial flavors or fillers.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--surface-container-low)]">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--foreground)]">Slow Cooked Fresh</h4>
            <p className="text-xs text-[var(--muted)]">Handcrafted in small weekly batches.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--surface-container-low)]">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--foreground)]">Fast Local Delivery</h4>
            <p className="text-xs text-[var(--muted)]">Carefully packed straight to your door.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
