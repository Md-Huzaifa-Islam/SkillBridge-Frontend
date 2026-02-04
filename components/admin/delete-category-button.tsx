"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/categories";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    const response = await deleteCategory(categoryId);

    if (response.success) {
      toast("Category deleted successfully", "success");
      router.refresh();
    } else {
      toast(response.message || "Failed to delete category", "error");
    }
    setLoading(false);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
