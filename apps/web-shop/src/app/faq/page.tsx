import type { Metadata } from "next";
import { FaqAccordion } from "@/components/features/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Bren Raphael's Ube Jam & Halaya Shop",
  description: "Find answers to frequently asked questions about ordering, delivery, shelf life, ingredients, and support for Bren Raphael's Ube Halaya.",
};

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
          Have questions about our artisanal Ube Halaya? Browse our common questions below or contact our support team.
        </p>
      </div>

      <FaqAccordion />
    </div>
  );
}
