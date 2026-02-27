"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSlotAction } from "@/action/tutorActions";
import type { Available, WeekDay } from "@/lib/api";
import { Button } from "@/components/ui/button";

const ALL_DAYS: { value: WeekDay; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

type Props = {
  /** Current available days from the backend */
  availabilities: Available[];
  /** TutorProfile.id — used as :id in PATCH /tutors/slot/:id */
  tutorProfileId: string;
};

export default function AvailabilityManager({
  availabilities,
  tutorProfileId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialise selected days from current availabilities
  const [selectedDays, setSelectedDays] = useState<Set<WeekDay>>(
    () => new Set(availabilities.map((a) => a.day)),
  );

  const toggle = (day: WeekDay) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
    setSuccess(false);
  };

  const handleSave = () => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateSlotAction(tutorProfileId, Array.from(selectedDays));
        setSuccess(true);
        router.refresh();
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Failed to update availability.",
        );
      }
    });
  };

  return (
    <div className="space-y-5 border rounded-xl p-6 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Select the days of the week you are available to teach. Students will
        pick a date matching one of these days when booking.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_DAYS.map(({ value, label }) => {
          const checked = selectedDays.has(value);
          return (
            <label
              key={value}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors select-none ${
                checked
                  ? "border-primary bg-primary/5 font-medium"
                  : "hover:bg-muted/50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(value)}
                className="accent-primary"
              />
              <span className="text-sm">{label}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Availability saved!</p>}

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Save Availability"}
      </Button>
    </div>
  );
}
