"use client";

import { useState, useTransition } from "react";
import { updateBookingStatusAction } from "@/action/bookingActions";
import type { Booking } from "@/lib/api";
import ReviewForm from "@/components/tutors/ReviewForm";
import { StatusBadge } from "@/components/dashboard/ui";

type Props = {
  booking: Booking;
  role: "student" | "tutor";
};

/** Format an ISO date string as a human-readable date (e.g. "15 Mar 2024") */
function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Extract HH:MM from an ISO time string (e.g. "1970-01-01T09:00:00.000Z" → "09:00") */
function fmtTime(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export default function BookingCard({ booking: b, role }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const handleAction = (status: "completed" | "cancelled") => {
    setError(null);
    startTransition(async () => {
      try {
        await updateBookingStatusAction(b.id, status);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  };

  const otherParty =
    role === "student"
      ? (b.tutor?.user?.name ?? b.tutor?.title ?? "Tutor")
      : (b.student?.name ?? "Student");

  const hasReview = b.reviews && b.reviews.length > 0;

  return (
    <div className="border rounded-2xl p-5 space-y-4 bg-card hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {otherParty[0]?.toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">{otherParty}</p>
            {role === "student" && b.tutor?.title && (
              <p className="text-xs text-muted-foreground">{b.tutor.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {fmtDate(b.date)} · {fmtTime(b.startTime)} – {fmtTime(b.endTime)}
            </p>
            <p className="text-xs font-semibold text-primary">
              ${b.totalPrice}
            </p>
          </div>
        </div>
        <StatusBadge status={b.status} />
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Student: can cancel confirmed sessions */}
        {role === "student" && b.status === "confirmed" && (
          <button
            onClick={() => handleAction("cancelled")}
            disabled={isPending}
            className="text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {isPending ? "Cancelling…" : "Cancel Session"}
          </button>
        )}

        {/* Student: can leave a review for completed sessions without a review */}
        {role === "student" && b.status === "completed" && !hasReview && (
          <div className="w-full space-y-2">
            {!showReview ? (
              <button
                onClick={() => setShowReview(true)}
                className="text-xs text-primary border border-primary/30 hover:bg-primary/5 px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                ⭐ Leave a Review
              </button>
            ) : (
              <ReviewForm bookingId={b.id} />
            )}
          </div>
        )}

        {/* Student: show existing review */}
        {role === "student" && b.status === "completed" && hasReview && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            ⭐ {b.reviews![0].rating}/5
            {b.reviews![0].review ? ` — “${b.reviews![0].review}”` : ""}
          </p>
        )}

        {/* Tutor: can mark confirmed sessions as completed */}
        {role === "tutor" && b.status === "confirmed" && (
          <button
            onClick={() => handleAction("completed")}
            disabled={isPending}
            className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-semibold disabled:opacity-50 shadow-sm shadow-primary/20 hover:opacity-90 transition"
          >
            {isPending ? "Updating…" : "✓ Mark Complete"}
          </button>
        )}
      </div>
    </div>
  );
}
