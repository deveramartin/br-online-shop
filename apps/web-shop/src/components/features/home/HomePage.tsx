"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck, Star, ShoppingBag, Leaf, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
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

      {/* Trust Badges Bar */}
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

      {/* Signature Collection (Featured Products) */}
      <section className="py-20 bg-[var(--surface)]" id="shop">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">The Signature Collection</h2>
              <p className="text-[var(--muted)] mt-2 max-w-lg">
                From our classic Halaya to innovative spreads, experience the authentic taste of the Philippines.
              </p>
            </div>
            <Link
              href="/catalog"
              className="text-[var(--primary)] font-semibold flex items-center gap-1 group hover:underline"
            >
              View All Products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Card 1 */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col justify-between p-0 border-[var(--border)]/40">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-[var(--surface-container)]">
                  <span className="absolute top-3 left-3 z-10 bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Best Seller
                  </span>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzaufBSPYFdf3fPO70YykdtXCn5csIz0r4rbQBEhk-MSqqNakCA3CZR1RBHOAOsK2PifyEXLXkzc017M-RzLfiGTFBXn3KYIfuvgMtHtZT9tK32y85KHsTVVf7EiVlc393_b_e3jq4PCO7bvIFMGeSkTdulRIYlJB6HOZu4HemTLPd3M9VSUNuDVzVWmQ5mRuEBYCOGPbstdW8Z1J2mRHqsWa2-T00r66eXek3cbl7T_8jbeG9EEis"
                    alt="Classic Ube Halaya"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-[var(--foreground)]">Classic Ube Halaya</h3>
                  <p className="text-xs text-[var(--muted)]">Smooth & Creamy (350g)</p>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between">
                <span className="font-extrabold text-[var(--primary)] text-xl">₱250.00</span>
                <Button asChild size="icon" className="bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] rounded-xl">
                  <Link href="/catalog">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Product Card 2 */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col justify-between p-0 border-[var(--border)]/40">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-[var(--surface-container)]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOE8_Mrkdx-n3x0x4SQknuHkwHfIgt-4RztP4Eljr2mCdB66tdc8fnjpptGJG_Qn6BecTymZ5Jtzrd6zi9Br_FrxAoP9YIEUB-aNo-Z33zdv_P3Fyz-yHD9W6J4OG7yUVic5-1JqmNMOBKDBfIN-DM8hKbpblzPzezvnGdqWWDY_wz4r1EsfCNhOSSLc9yg7APFurBqvHCQY5Gqz-GLfOrt_Za__RjlFtlkA-yeGl18oZZUvW28iHt"
                    alt="Artisanal Ube Jam"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-[var(--foreground)]">Artisanal Ube Jam</h3>
                  <p className="text-xs text-[var(--muted)]">Chunky Texture (350g)</p>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between">
                <span className="font-extrabold text-[var(--primary)] text-xl">₱280.00</span>
                <Button asChild size="icon" className="bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] rounded-xl">
                  <Link href="/catalog">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Product Card 3 */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col justify-between p-0 border-[var(--border)]/40">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-[var(--surface-container)]">
                  <span className="absolute top-3 left-3 z-10 bg-[var(--secondary)] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    New Arrival
                  </span>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRam2zP86AUpI-MK_UnDYDZWM7nuuI5vc5xZ7FfVTdKtjTMtTb-4vHB6yuaDHT1KBEEZXhtlUndTGaHnsTwAZXTz3qhwcMR9ZGMULHqIPZY7fgsPLudrHxmy6hx9p3MCyy5aZBmUWsLfNOkTQZCAs1j9Uu520vc8jS7Wbg0iOLTwTVHZqkGRc5qy3UiAsinuIZmlg8bqwPTiahJgY-6RgnUmAsG3PCTSBuos1Nc-ZoElYPZVCIVn8H"
                    alt="Ube Macapuno"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-[var(--foreground)]">Ube Macapuno</h3>
                  <p className="text-xs text-[var(--muted)]">With Coconut Strings (380g)</p>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between">
                <span className="font-extrabold text-[var(--primary)] text-xl">₱320.00</span>
                <Button asChild size="icon" className="bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] rounded-xl">
                  <Link href="/catalog">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Product Card 4 */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col justify-between p-0 border-[var(--border)]/40">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-[var(--surface-container)]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGod9__0TiLZJC9XGLFDpYhihQhFLGHfhkaK7Gxqy0DfvDxgQrFJOOzpQEHpPHHf8DgACUrwYPMYEynJU1BHCkUn167nUF6DJdmLUJBaVM4G3j2xgkL6xTo9TCkUv5sdGoPJ6EpkSGSseco1JjZjtFNRnuBepJDz4nc3RFkgxiwkinVHhOQ6HdDFzrksd_lYj874trZ5dNDnvro3esqaZcnZIxP5NaoPDDBdWUThCTfNjP1PQn0ZA9"
                    alt="Heritage Gift Set"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-[var(--foreground)]">Heritage Gift Set</h3>
                  <p className="text-xs text-[var(--muted)]">Trio Collection Pack</p>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between">
                <span className="font-extrabold text-[var(--primary)] text-xl">₱750.00</span>
                <Button asChild size="icon" className="bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] rounded-xl">
                  <Link href="/catalog">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Story Section (Est. 1985) */}
      <section className="py-20 bg-[var(--surface-container-low)] overflow-hidden" id="about">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative bg-[var(--surface-container)]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-PA8YCI9FmMO0lDQcIyEfOW_y4uUy8pOnx8EmU-6UZETDfn7Tw-v7RaHdf8kaM3Ka4fGKhQSvVdlvQbvEIa0IXs3Dc5b-mOd8x6zYu_Y77_mjN9mQYLsDSsj5W4_6Rx-EFm_mzrSwpFNDDnj7Ns8s6kCM95G5op1W7K4jqjLYOxwnOpmMXx8xlH9Z30brTtqzn64GqGW8C9f7zVNgQyPGemAKPc3B7yqflaJ2aDype26Jq5Vl_9UG"
                  alt="Traditional Heritage Ube Cooking"
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

      {/* Testimonials */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[var(--foreground)] mb-12">Loved by Generations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 bg-[var(--surface-container-low)] rounded-2xl text-left space-y-4 flex flex-col justify-between border border-transparent hover:border-[var(--primary)]/10 transition-all">
              <div className="flex gap-1 text-[var(--primary)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--primary)]" />
                ))}
              </div>
              <p className="italic text-[var(--muted)] text-sm leading-relaxed">
                &quot;The texture is exactly how my grandmother used to make it. Not too sweet, perfectly smooth. Bren Raphael&apos;s has truly mastered the classic Halaya.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold flex items-center justify-center text-sm">
                  MC
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">Maria C.</h4>
                  <p className="text-xs text-[var(--muted)]">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 bg-white rounded-2xl text-left space-y-4 flex flex-col justify-between border border-[var(--primary)]/20 shadow-lg scale-105 z-10">
              <div className="flex gap-1 text-[var(--primary)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--primary)]" />
                ))}
              </div>
              <p className="italic text-[var(--muted)] text-sm leading-relaxed">
                &quot;I&apos;ve tried many ube jams online, but this one stands out for its richness and authentic flavor. The packaging is also beautiful, perfect for gifting!&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold flex items-center justify-center text-sm">
                  RL
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">Ricardo L.</h4>
                  <p className="text-xs text-[var(--muted)]">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 bg-[var(--surface-container-low)] rounded-2xl text-left space-y-4 flex flex-col justify-between border border-transparent hover:border-[var(--primary)]/10 transition-all">
              <div className="flex gap-1 text-[var(--primary)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--primary)]" />
                ))}
              </div>
              <p className="italic text-[var(--muted)] text-sm leading-relaxed">
                &quot;Shipped surprisingly fast and arrived in perfect condition. It goes perfectly with warm pandesal in the morning. A must-buy!&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold flex items-center justify-center text-sm">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">Sarah J.</h4>
                  <p className="text-xs text-[var(--muted)]">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="relative bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--secondary)] rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Join the Family</h2>
              <p className="text-white/80 text-sm md:text-base">
                Sign up for exclusive offers, new product launches, and traditional recipes from our kitchen to yours.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Salamat! You have been subscribed.");
                }}
                className="flex flex-col sm:flex-row gap-3 mt-6"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="px-6 py-3.5 rounded-full bg-white text-[var(--foreground)] text-sm border-none focus:outline-none focus:ring-2 focus:ring-white w-full"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 py-3.5 bg-white text-[var(--primary-dark)] font-bold text-sm rounded-full hover:bg-gray-100 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Subscribe Now
                </Button>
              </form>
              <p className="text-[11px] text-white/60 pt-2">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
