import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-surface-container border-t border-border mt-auto py-12">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo.jpeg"
              alt="Bren Raphael's Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold text-base text-primary-dark">
              Bren Raphael&apos;s
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Artisanal Filipino Ube Jam & Halaya handcrafted with authentic purple yam and traditional heritage recipes.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-muted">
            <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link href="/#about" className="hover:text-primary">Our Heritage Story</Link></li>
            <li><Link href="/#faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-3">
            Customer Service
          </h4>
          <ul className="space-y-2 text-xs text-muted">
            <li><Link href="/#faq" className="hover:text-primary">FAQ & Delivery</Link></li>
            <li><Link href="/#about" className="hover:text-primary">About Our Craft</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-3">
            Newsletter
          </h4>
          <p className="text-xs text-muted mb-3">
            Subscribe for fresh batch announcements and special offers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-1.5 text-xs rounded-md border border-border bg-surface-card w-full focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}&nbsp;Bren Raphael&apos;s&nbsp;Ube Jam & Halaya Shop. All rights reserved.
      </div>
    </footer>
  );
}
