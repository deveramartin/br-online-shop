import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  initials: string;
  role: string;
  highlighted?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      '"The texture is exactly how my grandmother used to make it. Not too sweet, perfectly smooth. Bren Raphael\'s has truly mastered the classic Halaya."',
    author: "Maria C.",
    initials: "MC",
    role: "Verified Buyer",
  },
  {
    id: "2",
    quote:
      '"I\'ve tried many ube jams online, but this one stands out for its richness and authentic flavor. The packaging is also beautiful, perfect for gifting!"',
    author: "Ricardo L.",
    initials: "RL",
    role: "Verified Buyer",
    highlighted: true,
  },
  {
    id: "3",
    quote:
      '"Shipped surprisingly fast and arrived in perfect condition. It goes perfectly with warm pandesal in the morning. A must-buy!"',
    author: "Sarah J.",
    initials: "SJ",
    role: "Verified Buyer",
  },
];

export function HomeTestimonials() {
  return (
    <section className="py-20 bg-[var(--surface)]">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-[var(--foreground)] mb-12">Loved by Generations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className={`p-8 rounded-2xl text-left space-y-4 flex flex-col justify-between transition-all ${
                item.highlighted
                  ? "bg-white border border-[var(--primary)]/20 shadow-lg scale-105 z-10"
                  : "bg-[var(--surface-container-low)] border border-transparent hover:border-[var(--primary)]/10"
              }`}
            >
              <div className="flex gap-1 text-[var(--primary)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--primary)]" />
                ))}
              </div>
              <p className="italic text-[var(--muted)] text-sm leading-relaxed">{item.quote}</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold flex items-center justify-center text-sm">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{item.author}</h4>
                  <p className="text-xs text-[var(--muted)]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
