import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: {
    text: string;
    variant: "primary" | "secondary";
  };
}

const PRODUCTS: ProductItem[] = [
  {
    id: "1",
    name: "Classic Ube Halaya",
    subtitle: "Smooth & Creamy (350g)",
    price: "₱250.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzaufBSPYFdf3fPO70YykdtXCn5csIz0r4rbQBEhk-MSqqNakCA3CZR1RBHOAOsK2PifyEXLXkzc017M-RzLfiGTFBXn3KYIfuvgMtHtZT9tK32y85KHsTVVf7EiVlc393_b_e3jq4PCO7bvIFMGeSkTdulRIYlJB6HOZu4HemTLPd3M9VSUNuDVzVWmQ5mRuEBYCOGPbstdW8Z1J2mRHqsWa2-T00r66eXek3cbl7T_8jbeG9EEis",
    badge: { text: "Best Seller", variant: "primary" },
  },
  {
    id: "2",
    name: "Artisanal Ube Jam",
    subtitle: "Chunky Texture (350g)",
    price: "₱280.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOE8_Mrkdx-n3x0x4SQknuHkwHfIgt-4RztP4Eljr2mCdB66tdc8fnjpptGJG_Qn6BecTymZ5Jtzrd6zi9Br_FrxAoP9YIEUB-aNo-Z33zdv_P3Fyz-yHD9W6J4OG7yUVic5-1JqmNMOBKDBfIN-DM8hKbpblzPzezvnGdqWWDY_wz4r1EsfCNhOSSLc9yg7APFurBqvHCQY5Gqz-GLfOrt_Za__RjlFtlkA-yeGl18oZZUvW28iHt",
  },
  {
    id: "3",
    name: "Ube Macapuno",
    subtitle: "With Coconut Strings (380g)",
    price: "₱320.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRam2zP86AUpI-MK_UnDYDZWM7nuuI5vc5xZ7FfVTdKtjTMtTb-4vHB6yuaDHT1KBEEZXhtlUndTGaHnsTwAZXTz3qhwcMR9ZGMULHqIPZY7fgsPLudrHxmy6hx9p3MCyy5aZBmUWsLfNOkTQZCAs1j9Uu520vc8jS7Wbg0iOLTwTVHZqkGRc5qy3UiAsinuIZmlg8bqwPTiahJgY-6RgnUmAsG3PCTSBuos1Nc-ZoElYPZVCIVn8H",
    badge: { text: "New Arrival", variant: "secondary" },
  },
  {
    id: "4",
    name: "Heritage Gift Set",
    subtitle: "Trio Collection Pack",
    price: "₱750.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGod9__0TiLZJC9XGLFDpYhihQhFLGHfhkaK7Gxqy0DfvDxgQrFJOOzpQEHpPHHf8DgACUrwYPMYEynJU1BHCkUn167nUF6DJdmLUJBaVM4G3j2xgkL6xTo9TCkUv5sdGoPJ6EpkSGSseco1JjZjtFNRnuBepJDz4nc3RFkgxiwkinVHhOQ6HdDFzrksd_lYj874trZ5dNDnvro3esqaZcnZIxP5NaoPDDBdWUThCTfNjP1PQn0ZA9",
  },
];

function ProductCard({ product }: { product: ProductItem }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col justify-between p-0 border-[var(--border)]/40">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-[var(--surface-container)]">
          {product.badge && (
            <span
              className={`absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                product.badge.variant === "primary" ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"
              }`}
            >
              {product.badge.text}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5 space-y-2">
          <h3 className="font-bold text-lg text-[var(--foreground)]">{product.name}</h3>
          <p className="text-xs text-[var(--muted)]">{product.subtitle}</p>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="font-extrabold text-[var(--primary)] text-xl">{product.price}</span>
        <Button asChild size="icon" className="bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] rounded-xl">
          <Link href="/catalog">
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function HomeSignatureCollection() {
  return (
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
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
