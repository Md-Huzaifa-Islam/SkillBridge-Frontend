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
      <div className="flex items-center gap-3 border rounded-lg px-4 py-2">
        {isEditing ? (
          <>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 h-8 text-sm"
              disabled={isPending}
              autoFocus
            />
            <Button size="sm" onClick={handleUpdate} disabled={isPending}>
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
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm font-medium">{category.name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500 px-4">{error}</p>}
    </div>
  );
}
