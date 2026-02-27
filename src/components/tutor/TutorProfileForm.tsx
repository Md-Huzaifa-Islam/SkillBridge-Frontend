"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createTutorProfileAction,
  updateTutorProfileAction,
} from "@/action/tutorActions";
import type { Category, TutorProfile } from "@/lib/api";

type Props = {
  profile: TutorProfile | null;
  categories: Category[];
};

/** Extract "HH:MM" from an ISO datetime string (e.g. "1970-01-01T09:00:00.000Z") */
function isoToTimeInput(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return "";
  }
}

/** Append ":00" to turn "HH:MM" into "HH:MM:SS" expected by the backend */
function timeInputToBackend(v: string): string {
  return v.length === 5 ? `${v}:00` : v;
}

export default function TutorProfileForm({ profile, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(profile?.title ?? "");
  const [description, setDescription] = useState(profile?.description ?? "");
  const [pricePerHour, setPricePerHour] = useState(
    profile?.pricePerHour?.toString() ?? "",
  );
  const [startTime, setStartTime] = useState(
    isoToTimeInput(profile?.startTime),
  );
  const [endTime, setEndTime] = useState(isoToTimeInput(profile?.endTime));
  const [categoryId, setCategoryId] = useState(profile?.categoryId ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!pricePerHour || Number(pricePerHour) < 1) {
      setError("Price per hour must be at least 1.");
      return;
    }
    if (!startTime || !endTime) {
      setError("Start time and end time are required.");
      return;
    }
    if (!categoryId) {
      setError("Category is required.");
      return;
    }

    const start_time = timeInputToBackend(startTime);
    const end_time = timeInputToBackend(endTime);

    startTransition(async () => {
      try {
        if (profile) {
          await updateTutorProfileAction({
            title,
            description: description || undefined,
            pricePerHour: Number(pricePerHour),
            start_time,
            end_time,
            categoryId,
          });
        } else {
          await createTutorProfileAction({
            title,
            description: description || undefined,
            pricePerHour: Number(pricePerHour),
            start_time,
            end_time,
            categoryId,
          });
        }
        setSuccess(true);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to save profile.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border rounded-xl p-6">
      {/* Title */}
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Expert Math Tutor"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tell students about yourself…"
        />
      </div>

      {/* Price Per Hour */}
      <div className="space-y-1">
        <label htmlFor="pricePerHour" className="text-sm font-medium">
          Price per Hour ($) <span className="text-red-500">*</span>
        </label>
        <Input
          id="pricePerHour"
          type="number"
          min="1"
          step="1"
          value={pricePerHour}
          onChange={(e) => setPricePerHour(e.target.value)}
          placeholder="e.g. 25"
          required
        />
      </div>

      {/* Time range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="startTime" className="text-sm font-medium">
            Start Time <span className="text-red-500">*</span>
          </label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="endTime" className="text-sm font-medium">
            End Time <span className="text-red-500">*</span>
          </label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">— Select a category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Profile saved successfully!</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : profile ? "Update Profile" : "Create Profile"}
      </Button>
    </form>
  );
}
