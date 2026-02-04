"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserStatus } from "@/actions/admin";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export function ToggleBanButton({
  userId,
  isBanned,
  disabled,
}: {
  userId: string;
  isBanned: boolean;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    const response = await updateUserStatus(userId, !isBanned);

    if (response.success) {
      toast(
        isBanned ? "User unbanned successfully" : "User banned successfully",
        "success",
      );
      router.refresh();
    } else {
      toast(response.message || "Failed to update user status", "error");
    }
    setLoading(false);
  };

  if (disabled) {
    return (
      <Button variant="outline" disabled>
        Cannot Ban Admin
      </Button>
    );
  }

  return (
    <Button
      variant={isBanned ? "outline" : "destructive"}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "Loading..." : isBanned ? "Unban" : "Ban User"}
    </Button>
  );
}
