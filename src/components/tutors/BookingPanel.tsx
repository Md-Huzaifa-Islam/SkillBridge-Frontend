"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/action/bookingActions";
import type { Available } from "@/lib/api";

/** Day-of-week index for each WeekDay string (0 = Sunday) */
const DAY_TO_DOW: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const toBackendTime = (v: string) => (v.length === 5 ? `${v}:00` : v);

type Props = {
  /** TutorProfile.id */
  tutorId: string;
  availabilities: Available[];
  isLoggedIn: boolean;
};

export default function BookingPanel({
  tutorId,
  availabilities,
  isLoggedIn,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedAvail, setSelectedAvail] = useState<Available | null>(null);
  const [dateStr, setDateStr] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const minDate = new Date().toISOString().slice(0, 10);

  const isDateValidForDay = (date: string, avail: Available): boolean => {
    if (!date) return true;
    const d = new Date(date + "T00:00:00");
    return d.getDay() === DAY_TO_DOW[avail.day];
  };

  const handleBook = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!selectedAvail || !dateStr || !startTime || !endTime) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isDateValidForDay(dateStr, selectedAvail)) {
      setError(
        `Chosen date is not a ${cap(selectedAvail.day)}. Please pick a matching date.`,
      );
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await createBookingAction({
          tutor_profile_id: tutorId,
          available_id: selectedAvail.id,
          date_str: dateStr,
          start_time: toBackendTime(startTime),
          end_time: toBackendTime(endTime),
        });
        setSuccess(true);
        router.push("/dashboard/bookings");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Booking failed.");
      }
    });
  };

  if (availabilities.length === 0) {
    return (
      <div className="border rounded-xl p-5 text-center text-muted-foreground text-sm">
        This tutor has no available days set yet.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-5 space-y-5">
      <h3 className="font-semibold">Book a Session</h3>

      {/* Step 1: pick a day */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          1. Choose an available day
        </p>
        <div className="flex flex-wrap gap-2">
          {availabilities.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setSelectedAvail(a);
                setDateStr("");
                setError(null);
              }}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                selectedAvail?.id === a.id
                  ? "border-primary bg-primary/5 font-medium"
                  : "hover:bg-muted/50"
              }`}
            >
              {cap(a.day)}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: pick date & time */}
      {selectedAvail && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            2. Pick a {cap(selectedAvail.day)} date &amp; time
          </p>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Date</label>
            <input
              type="date"
              min={minDate}
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {dateStr && !isDateValidForDay(dateStr, selectedAvail) && (
              <p className="text-xs text-amber-500">
                Please select a {cap(selectedAvail.day)}.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Booking created!</p>}

      <button
        onClick={handleBook}
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {isPending
          ? "Booking…"
          : isLoggedIn
            ? "Confirm Booking"
            : "Login to Book"}
      </button>
    </div>
  );
}
