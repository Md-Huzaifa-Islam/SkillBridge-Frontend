"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Profile update currently only sends a name change via the /auth/me endpoint.
// Extend this if a dedicated PATCH /users/me endpoint is added to the backend.
export default function EditProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      // Placeholder until a PATCH /auth/me or /users/me endpoint is available.
      await new Promise((r) => setTimeout(r, 300));
      setMessage("Profile updated (no-op — backend endpoint pending).");
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
        />
      </div>
      {message && <p className="text-sm text-primary">{message}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
