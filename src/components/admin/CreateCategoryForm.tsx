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
    <div className="space-y-2 border rounded-2xl p-5 bg-card shadow-sm">
      <p className="text-sm font-semibold">Add New Category</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Category name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 h-11"
          disabled={isPending}
        />
        <Button
          type="submit"
          disabled={isPending || !newName.trim()}
          className="h-11 px-5 font-semibold shrink-0"
        >
          {isPending ? "Adding…" : "+ Add"}
        </Button>
      </form>
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
