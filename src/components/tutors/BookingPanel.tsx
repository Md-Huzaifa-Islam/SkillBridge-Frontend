"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/action/bookingActions";
import type { AvailableSlot } from "@/lib/api";

type Props = {
  tutorId: string;
  slots: AvailableSlot[];
  isLoggedIn: boolean;
};

export default function BookingPanel({ tutorId, slots, isLoggedIn }: Props) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const available = slots.filter((s) => !s.isBooked);

  const handleBook = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!selectedSlot) return;
    setError(null);
    startTransition(async () => {
      try {
        await createBookingAction({ tutorId, slotId: selectedSlot });
        setSuccess(true);
        router.push("/dashboard/bookings");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Booking failed.");
      }
    });
  };

  if (available.length === 0) {
    return (
      <div className="border rounded-xl p-5 text-center text-muted-foreground text-sm">
        No available slots at the moment.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold">Book a Session</h3>
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {available.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setSelectedSlot(slot.id)}
            className={`w-full text-left rounded-lg border px-4 py-2 text-sm transition-colors ${
              selectedSlot === slot.id
                ? "border-primary bg-primary/5 font-medium"
                : "hover:bg-muted/50"
            }`}
          >
            {slot.date} · {slot.startTime} – {slot.endTime}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Booking created!</p>}
      <button
        onClick={handleBook}
        disabled={(!selectedSlot && isLoggedIn) || isPending}
        className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {isPending
          ? "Booking…"
          : isLoggedIn
            ? selectedSlot
              ? "Confirm Booking"
              : "Select a slot above"
            : "Login to Book"}
      </button>
    </div>
  );
}
