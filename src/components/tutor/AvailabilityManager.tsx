"use client";

import { useState, useTransition } from "react";
import { updateSlotAction } from "@/action/tutorActions";
import type { AvailableSlot } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AvailabilityManager({
  slots,
}: {
  slots: AvailableSlot[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localSlots, setLocalSlots] = useState<AvailableSlot[]>(slots);

  const toggleBooked = (slot: AvailableSlot) => {
    setError(null);
    startTransition(async () => {
      try {
        await updateSlotAction(slot.id, { isBooked: !slot.isBooked });
        setLocalSlots((prev) =>
          prev.map((s) =>
            s.id === slot.id ? { ...s, isBooked: !s.isBooked } : s,
          ),
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update slot.");
      }
    });
  };

  if (localSlots.length === 0) {
    return (
      <div className="border rounded-xl p-8 text-center text-muted-foreground text-sm">
        No availability slots found. Slots are created from the backend seed or
        admin panel.
      </div>
    );
  }

  const available = localSlots.filter((s) => !s.isBooked);
  const booked = localSlots.filter((s) => s.isBooked);

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <section>
        <h2 className="font-semibold mb-3">
          Available Slots{" "}
          <span className="text-muted-foreground font-normal text-sm">
            ({available.length})
          </span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onToggle={toggleBooked}
              disabled={isPending}
            />
          ))}
        </div>
      </section>

      {booked.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">
            Booked Slots{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({booked.length})
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {booked.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onToggle={toggleBooked}
                disabled={isPending}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SlotCard({
  slot,
  onToggle,
  disabled,
}: {
  slot: AvailableSlot;
  onToggle: (s: AvailableSlot) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`border rounded-xl p-4 space-y-2 ${slot.isBooked ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            slot.isBooked
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {slot.isBooked ? "Booked" : "Available"}
        </span>
      </div>
      <p className="text-sm font-medium">{slot.date}</p>
      <p className="text-xs text-muted-foreground">
        {slot.startTime} – {slot.endTime}
      </p>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onToggle(slot)}
        className="w-full text-xs"
      >
        {slot.isBooked ? "Mark Available" : "Mark Booked"}
      </Button>
    </div>
  );
}
