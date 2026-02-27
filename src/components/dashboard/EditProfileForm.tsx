"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/action/authActions";

export default function EditProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        await updateProfileAction(name.trim());
        setMessage("Profile updated successfully.");
        router.refresh();
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to update profile.",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-6">
      <h2 className="font-semibold">Edit Profile</h2>
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
