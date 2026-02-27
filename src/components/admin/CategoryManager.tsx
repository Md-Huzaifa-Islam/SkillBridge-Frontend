"use client";

import { useState, useTransition } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/action/adminActions";
import type { Category } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = (await createCategoryAction(newName.trim())) as {
          data?: Category;
          id?: string;
          name?: string;
        };
        const created: Category = result.data ?? (result as Category);
        setCategories((prev) => [...prev, created]);
        setNewName("");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create category.");
      }
    });
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateCategoryAction(id, editName.trim());
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, name: editName.trim() } : c)),
        );
        setEditingId(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update.");
      }
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategoryAction(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Create */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          placeholder="New category name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !newName.trim()}>
          Add
        </Button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* List */}
      <div className="space-y-2">
        {categories.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No categories yet. Add one above.
          </p>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 border rounded-lg px-4 py-2"
          >
            {editingId === cat.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 h-8 text-sm"
                  disabled={isPending}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => handleUpdate(cat.id)}
                  disabled={isPending}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium">{cat.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                  disabled={isPending}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(cat.id)}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
