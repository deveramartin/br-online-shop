import type { Metadata } from "next";
import { ContactInfo } from "@/components/features/contact/ContactInfo";
import { ContactForm } from "@/components/features/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Bren Raphael's Ube Jam & Halaya Shop",
  description: "Get in touch with Bren Raphael's Ube Jam & Halaya Shop team for questions, support, or bulk order inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
          We would love to hear from you! Send us your inquiries or stop by our store in Baguio City.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
}
