"use client";

import { useState, useTransition } from "react";
import { updateBookingStatusAction } from "@/action/bookingActions";
import type { Booking } from "@/lib/api";

type Props = {
  booking: Booking;
  role: "student" | "tutor";
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-muted text-muted-foreground",
};

export default function BookingCard({ booking: b, role }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAction = (status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    setError(null);
    startTransition(async () => {
      try {
        await updateBookingStatusAction(b.id, status);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  };

  const otherParty = role === "student" ? b.tutor?.user?.name : b.student?.name;

  return (
    <div className="border rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-sm">{otherParty ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {b.slot?.date ?? "—"} · {b.slot?.startTime ?? "—"} –{" "}
            {b.slot?.endTime ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total: ${b.totalPrice}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[b.status] ?? ""}`}
        >
          {b.status}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Student actions */}
      {role === "student" && b.status === "PENDING" && (
        <button
          onClick={() => handleAction("CANCELLED")}
          disabled={isPending}
          className="text-xs text-red-600 hover:underline disabled:opacity-50"
        >
          Cancel
        </button>
      )}

      {/* Tutor actions */}
      {role === "tutor" && b.status === "PENDING" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("CONFIRMED")}
            disabled={isPending}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            onClick={() => handleAction("CANCELLED")}
            disabled={isPending}
            className="text-xs border text-red-600 px-3 py-1 rounded-lg disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}
      {role === "tutor" && b.status === "CONFIRMED" && (
        <button
          onClick={() => handleAction("COMPLETED")}
          disabled={isPending}
          className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg disabled:opacity-50"
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}
