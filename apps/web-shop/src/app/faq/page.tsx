export const metadata = {
  title: "Frequently Asked Questions | Bren Raphael's Ube Jam & Halaya",
  description: "Find answers to commonly asked questions about our products, shelf life, delivery, and ingredients.",
};

const FAQS = [
  {
    question: "How long does Bren Raphael's Ube Halaya last?",
    answer: "Unopened jars last up to 3 weeks when refrigerated. Once opened, we recommend consuming within 7-10 days for optimal freshness.",
  },
  {
    question: "Are your products 100% natural?",
    answer: "Yes! We use 100% authentic local purple yam tubers without artificial fillers, preservatives, or synthetic dyes.",
  },
  {
    question: "Do you offer nationwide shipping?",
    answer: "We offer 24h fast delivery across Metro Manila and express courier shipping across major provinces in the Philippines.",
  },
  {
    question: "How should I store my Ube Jam upon arrival?",
    answer: "Please refrigerate your jars immediately upon arrival to preserve their rich, velvety consistency and natural flavor.",
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-primary font-bold text-xs uppercase tracking-widest block">
          Got Questions?
        </span>
        <h1 className="text-4xl font-extrabold text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto">
          Everything you need to know about our artisanal Ube Halaya preserves and delivery.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-border/70 bg-surface-card shadow-sm space-y-2">
            <h3 className="font-bold text-lg text-foreground">
              {faq.question}
            </h3>
            <p className="text-muted text-sm leading-relaxed pt-1">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
