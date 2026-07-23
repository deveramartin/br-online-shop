"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/api-client";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/contact", formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Send Us a Message</h2>
      <p className="text-sm text-slate-500 mb-6">
        Fill out the form below and our team will get back to you within 24 hours.
      </p>

      {isSuccess ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
          <h3 className="text-base font-semibold text-emerald-900">Message Sent Successfully!</h3>
          <p className="mt-1 text-xs text-emerald-700">
            Thank you for reaching out. A confirmation email has been dispatched via Brevo SMTP to our team.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-4 rounded-xl bg-[#451077] px-4 py-2 text-xs font-medium text-white hover:bg-[#340c5a]"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan dela Cruz"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#451077] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#451077]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#451077] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#451077]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Inquiry about Ube Halaya order"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#451077] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#451077]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you?"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#451077] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#451077]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#451077] py-3 text-xs font-semibold text-white shadow-md hover:bg-[#340c5a] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Inquiry
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
