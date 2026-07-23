"use client";

import { FaqAccordion } from "../faq/FaqAccordion";

export function HomeFaqSection() {
  return (
    <section id="faq" className="py-20 bg-slate-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(120,119,198,0.08),transparent)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center space-y-3">
          <span className="text-primary font-bold text-xs uppercase tracking-widest block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
            Have questions about our artisanal Ube Halaya? Browse our common questions below or reach out to our team.
          </p>
        </div>

        <FaqAccordion />
      </div>
    </section>
  );
}
