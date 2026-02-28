"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateCategoryAction,
  deleteCategoryAction,
} from "@/action/adminActions";
import type { Category } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryItem({ category }: { category: Category }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!editName.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateCategoryAction(category.id, editName.trim());
        setIsEditing(false);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update.");
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategoryAction(category.id);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete.");
      }
    });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-card hover:shadow-sm transition-shadow">
        {isEditing ? (
          <>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 h-9 text-sm"
              disabled={isPending}
              autoFocus
            />
            <Button size="sm" onClick={handleUpdate} disabled={isPending} className="shrink-0">
              {isPending ? "Saving…" : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditName(category.name);
              }}
              disabled={isPending}
              className="shrink-0"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm font-semibold">{category.name}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
              className="shrink-0 h-8 text-xs"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 h-8 text-xs"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-destructive px-4">{error}</p>}
    </div>
  );
}
