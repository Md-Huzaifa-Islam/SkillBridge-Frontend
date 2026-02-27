"use client";

import { useState, useTransition } from "react";
import { updateBookingStatusAction } from "@/action/bookingActions";
import type { Booking, BookingStatus } from "@/lib/api";
import ReviewForm from "@/components/tutors/ReviewForm";

type Props = {
  booking: Booking;
  role: "student" | "tutor";
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-600",
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
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-medium text-sm">{otherParty}</p>
          {role === "student" && b.tutor?.title && (
            <p className="text-xs text-muted-foreground">{b.tutor.title}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {fmtDate(b.date)} · {fmtTime(b.startTime)} – {fmtTime(b.endTime)}
          </p>
          <p className="text-xs text-muted-foreground">
            Total: ${b.totalPrice}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLOR[b.status] ?? ""}`}
        >
          {b.status}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Student: can cancel confirmed sessions */}
      {role === "student" && b.status === "confirmed" && (
        <button
          onClick={() => handleAction("cancelled")}
          disabled={isPending}
          className="text-xs text-red-600 hover:underline disabled:opacity-50"
        >
          Cancel Session
        </button>
      )}

      {/* Student: can leave a review for completed sessions without a review */}
      {role === "student" && b.status === "completed" && !hasReview && (
        <div className="space-y-2">
          {!showReview ? (
            <button
              onClick={() => setShowReview(true)}
              className="text-xs text-primary hover:underline"
            >
              Leave a Review
            </button>
          ) : (
            <ReviewForm bookingId={b.id} />
          )}
        </div>
      )}

      {/* Student: show existing review */}
      {role === "student" && b.status === "completed" && hasReview && (
        <p className="text-xs text-muted-foreground">
          ⭐ {b.reviews![0].rating}/5
          {b.reviews![0].review ? ` — "${b.reviews![0].review}"` : ""}
        </p>
      )}

      {/* Tutor: can mark confirmed sessions as completed */}
      {role === "tutor" && b.status === "confirmed" && (
        <button
          onClick={() => handleAction("completed")}
          disabled={isPending}
          className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg disabled:opacity-50"
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}

