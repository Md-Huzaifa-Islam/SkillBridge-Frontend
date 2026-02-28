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
    <form onSubmit={handleSubmit} className="space-y-5 border rounded-2xl p-6 bg-card shadow-sm">
      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-semibold">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Expert Math Tutor"
          className="h-11"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-semibold">
          Description{" "}
          <span className="text-muted-foreground font-normal text-xs">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition"
          placeholder="Tell students about yourself…"
        />
      </div>

      {/* Price Per Hour */}
      <div className="space-y-1.5">
        <label htmlFor="pricePerHour" className="text-sm font-semibold">
          Price per Hour ($) <span className="text-destructive">*</span>
        </label>
        <Input
          id="pricePerHour"
          type="number"
          min="1"
          step="1"
          value={pricePerHour}
          onChange={(e) => setPricePerHour(e.target.value)}
          placeholder="e.g. 25"
          className="h-11"
          required
        />
      </div>

      {/* Time range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="startTime" className="text-sm font-semibold">
            Start Time <span className="text-destructive">*</span>
          </label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="endTime" className="text-sm font-semibold">
            End Time <span className="text-destructive">*</span>
          </label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="h-11"
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-semibold">
          Category <span className="text-destructive">*</span>
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition h-11"
        >
          <option value="">— Select a category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">✓ Profile saved successfully!</p>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full h-11 font-semibold shadow-sm shadow-primary/20">
        {isPending ? "Saving…" : profile ? "Update Profile" : "Create Profile"}
      </Button>
    </form>
  );
}
