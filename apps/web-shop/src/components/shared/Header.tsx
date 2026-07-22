import Link from "next/link";
import { ShoppingBag, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--surface-card)] border-b border-[var(--border)] shadow-xs">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.jpeg"
            alt="Bren Raphael's Ube Jam & Halaya Logo"
            className="w-10 h-10 rounded-full object-cover shadow-sm transition-transform group-hover:scale-105"
          />
          <div>
            <span className="font-bold text-lg leading-tight tracking-tight block text-[var(--primary-dark)]">
              Bren Raphael&apos;s
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--secondary)] block">
              Ube Jam & Halaya
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--foreground)]">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-[var(--primary)] transition-colors">
            Shop Catalog
          </Link>
          <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
            Our Heritage
          </Link>
          <Link href="/contact" className="hover:text-[var(--primary)] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>

          <Button asChild variant="ghost" size="icon" aria-label="Account" className="rounded-full">
            <Link href="/profile">
              <User className="w-5 h-5" />
            </Link>
          </Button>

          <Button size="icon" aria-label="Shopping Cart" className="relative rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[var(--secondary-light)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
