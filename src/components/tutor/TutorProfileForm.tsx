"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createTutorProfileAction,
  updateTutorProfileAction,
} from "@/action/tutorActions";
import type { Category, TutorDetail } from "@/lib/api";

type Props = {
  profile: TutorDetail | null;
  categories: Category[];
};

export default function TutorProfileForm({ profile, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [bio, setBio] = useState(profile?.bio ?? "");
  const [hourlyRate, setHourlyRate] = useState(
    profile?.hourlyRate?.toString() ?? "",
  );
  const [subjectsRaw, setSubjectsRaw] = useState(
    profile?.subjects?.join(", ") ?? "",
  );
  const [categoryId, setCategoryId] = useState(profile?.category?.id ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const subjects = subjectsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!bio || !hourlyRate || subjects.length === 0) {
      setError("Bio, hourly rate, and at least one subject are required.");
      return;
    }

    const data = {
      bio,
      hourlyRate: parseFloat(hourlyRate),
      subjects,
      ...(categoryId ? { categoryId } : {}),
    };

    startTransition(async () => {
      try {
        if (profile) {
          await updateTutorProfileAction(data);
        } else {
          await createTutorProfileAction(data);
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
      <div className="space-y-1">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tell students about yourself…"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="hourlyRate" className="text-sm font-medium">
          Hourly Rate ($)
        </label>
        <Input
          id="hourlyRate"
          type="number"
          min="1"
          step="0.01"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          placeholder="e.g. 25"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="subjects" className="text-sm font-medium">
          Subjects{" "}
          <span className="text-muted-foreground font-normal">
            (comma-separated)
          </span>
        </label>
        <Input
          id="subjects"
          value={subjectsRaw}
          onChange={(e) => setSubjectsRaw(e.target.value)}
          placeholder="e.g. Math, Physics, Chemistry"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">— No category —</option>
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
