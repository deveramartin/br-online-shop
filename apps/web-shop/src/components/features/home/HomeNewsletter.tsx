import { Button } from "@/components/ui/button";

export function HomeNewsletter() {
  return (
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
  );
}
