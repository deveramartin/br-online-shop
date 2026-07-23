"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Star, MessageSquare, Loader2, CheckCircle2, Lock } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

interface ProductReviewsSectionProps {
  productId: string;
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const {
    reviews,
    averageRating,
    reviewCount,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    hasUserReviewed,
    isAuthenticated,
    submitReview,
  } = useReviews(productId);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || rating < 1 || rating > 5 || comment.length > 500) return;

    const ok = await submitReview(rating, comment.trim());
    if (ok) {
      setComment("");
    }
  };

  return (
    <section className="mt-16 border-t border-[var(--border)] pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--primary)] flex items-center gap-2">
            <MessageSquare className="w-6 h-6" /> Customer Reviews & Ratings
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1 font-medium">
            Real feedback from verified purchasers
          </p>
        </div>

        {/* Summary Rating Badge */}
        <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <div>
            <span className="text-lg font-extrabold text-[var(--primary)]">
              {averageRating > 0 ? averageRating : "No ratings"}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-1">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Review Form */}
        <div className="lg:col-span-5 bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Write a Review</h3>

          {!isAuthenticated ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 p-4">
              <Lock className="w-8 h-8 text-[#451077] mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium mb-3">
                You must be logged in to leave feedback or rate this product.
              </p>
              <Link
                href="/signin"
                className="inline-block w-full py-2 bg-[#451077] text-white text-xs font-semibold rounded-xl hover:bg-[#340c5a] transition-all"
              >
                Sign In to Review
              </Link>
            </div>
          ) : hasUserReviewed ? (
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-purple-900">Thank you for your feedback!</p>
              <p className="text-[11px] text-purple-700 mt-1">
                You have already submitted a review for this product.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                  {successMessage}
                </div>
              )}

              {/* Interactive Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Rating (1 to 5 stars)
                </label>
                <div className="flex items-center gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Feedback Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Feedback</label>
                  <span
                    className={`text-[10px] font-semibold ${
                      comment.length > 500 ? "text-red-500" : "text-slate-400"
                    }`}
                  >
                    {comment.length} / 500
                  </span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Share your thoughts about this product's taste, quality, packaging..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#451077] focus:ring-1 focus:ring-[#451077]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!comment.trim() || isSubmitting || comment.length > 500}
                className="w-full py-2.5 bg-[#451077] text-white text-xs font-bold rounded-xl hover:bg-[#340c5a] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit Feedback & Rating"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Reviews ({reviewCount})
          </h3>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#451077]" />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200/60 rounded-2xl text-slate-500 text-xs">
              No reviews yet for this product. Be the first to leave feedback!
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2"
              >
                {/* Rating Stars & Date Only per spec */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Feedback Comment */}
                <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap break-words">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
