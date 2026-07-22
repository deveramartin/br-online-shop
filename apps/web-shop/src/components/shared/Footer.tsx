import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--surface-container)] border-t border-[var(--border)] mt-auto py-12">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
              BR
            </div>
            <span className="font-bold text-base text-[var(--primary-dark)]">
              Bren Raphael&apos;s
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Artisanal Filipino Ube Jam & Halaya handcrafted with authentic purple yam and traditional heritage recipes.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-[var(--muted)]">
            <li><Link href="/catalog" className="hover:text-[var(--primary)]">All Products</Link></li>
            <li><Link href="/about" className="hover:text-[var(--primary)]">Our Heritage Story</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--primary)]">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-3">
            Customer Service
          </h4>
          <ul className="space-y-2 text-xs text-[var(--muted)]">
            <li><Link href="/faq" className="hover:text-[var(--primary)]">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-[var(--primary)]">Shipping & Returns</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--primary)]">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-3">
            Newsletter
          </h4>
          <p className="text-xs text-[var(--muted)] mb-3">
            Subscribe for fresh batch announcements and special offers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-1.5 text-xs rounded-md border border-[var(--border)] bg-white w-full focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 mt-12 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} Bren Raphael&apos;s Ube Jam & Halaya Shop. All rights reserved.
      </div>
    </footer>
  );
}
