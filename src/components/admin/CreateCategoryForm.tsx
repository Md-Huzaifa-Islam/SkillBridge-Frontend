"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction } from "@/action/adminActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateCategoryForm() {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await createCategoryAction(newName.trim());
        setNewName("");
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create category.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="New category name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !newName.trim()}>
          {isPending ? "Adding…" : "Add"}
        </Button>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
