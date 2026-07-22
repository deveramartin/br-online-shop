import Image from "next/image";
import { Leaf, Award } from "lucide-react";

export function HomeBrandStory() {
  return (
    <section className="py-20 bg-[var(--surface-container-low)] overflow-hidden" id="about">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative bg-[var(--surface-container)]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-PA8YCI9FmMO0lDQcIyEfOW_y4uUy8pOnx8EmU-6UZETDfn7Tw-v7RaHdf8kaM3Ka4fGKhQSvVdlvQbvEIa0IXs3Dc5b-mOd8x6zYu_Y77_mjN9mQYLsDSsj5W4_6Rx-EFm_mzrSwpFNDDnj7Ns8s6kCM95G5op1W7K4jqjLYOxwnOpmMXx8xlH9Z30brTtqzn64GqGW8C9f7zVNgQyPGemAKPc3B7yqflaJ2aDype26Jq5Vl_9UG"
                alt="Traditional Heritage Ube Cooking"
                fill
                unoptimized
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 md:w-44 md:h-44 bg-[var(--primary)] rounded-xl flex items-center justify-center p-4 text-center text-white shadow-xl rotate-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-90">Est.</p>
                <p className="text-3xl font-extrabold">1985</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[var(--primary)] font-bold text-xs uppercase tracking-widest block">
              Our Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] leading-tight">
              Rooted in Tradition, Crafted for the Modern Palate
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              What started in a small family kitchen in the heart of the Philippines has grown into a beloved name in artisanal sweets. Bren Raphael&apos;s commitment to quality begins with sourcing the finest yams from local farmers who share our passion for heritage.
            </p>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Every batch is slow-cooked for hours, ensuring the natural sweetness and vibrant purple color are preserved without artificial flavors or preservatives. It&apos;s not just a spread; it&apos;s a piece of our history served on your table.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[var(--border)]/40 shadow-xs">
                <Leaf className="w-5 h-5 text-[var(--primary)] mb-2" />
                <h4 className="font-bold text-sm text-[var(--foreground)]">100% Natural</h4>
                <p className="text-xs text-[var(--muted)]">No artificial fillers</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[var(--border)]/40 shadow-xs">
                <Award className="w-5 h-5 text-[var(--primary)] mb-2" />
                <h4 className="font-bold text-sm text-[var(--foreground)]">Small Batches</h4>
                <p className="text-xs text-[var(--muted)]">Ensuring peak quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
