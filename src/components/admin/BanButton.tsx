"use client";

import { useState, useTransition } from "react";
import { banUserAction } from "@/action/adminActions";

type Props = {
  userId: string;
  currentStatus: "active" | "banned";
};

export default function BanButton({ userId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const nextStatus = currentStatus === "active" ? "banned" : "active";
  const label = currentStatus === "active" ? "Ban" : "Unban";

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        await banUserAction(userId, nextStatus);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`text-xs px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50 transition-colors ${
          currentStatus === "active"
            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
        }`}
      >
        {isPending ? "…" : label}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
