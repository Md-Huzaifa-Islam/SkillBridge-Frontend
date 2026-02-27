"use client";

import { useState, useTransition } from "react";
import { createReviewAction } from "@/action/reviewActions";
import { useRouter } from "next/navigation";

/**
 * Leave a review for a completed session.
 * Requires the bookingId — a review is linked to a single booking.
 */
export default function ReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createReviewAction(bookingId, {
          rating,
          review: review.trim() || undefined,
        });
        setSuccess(true);
        setReview("");
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to submit review.");
      }
    });
  };

  if (success)
    return (
      <p className="text-sm text-green-600">Review submitted! Thank you.</p>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded-xl p-5">
      <h3 className="font-semibold text-sm">Leave a Review</h3>

      {/* Star rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-xl transition-colors ${
              n <= rating ? "text-yellow-400" : "text-muted-foreground"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Review text (optional) */}
      <textarea
        rows={3}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience… (optional)"
        className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
