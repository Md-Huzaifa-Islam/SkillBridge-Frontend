"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export default function UsersFilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const role = sp.get("role") ?? "all";
  const status = sp.get("status") ?? "all";
  const search = sp.get("search") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(sp.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset page on filter change
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, sp],
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Role filter */}
      <select
        value={role}
        onChange={(e) => update("role", e.target.value)}
        className="text-sm border rounded-lg px-3 py-1.5 bg-background"
      >
        <option value="all">All Roles</option>
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => update("status", e.target.value)}
        className="text-sm border rounded-lg px-3 py-1.5 bg-background"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="banned">Banned</option>
      </select>

      {/* Search */}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const val = (
            e.currentTarget.elements.namedItem("q") as HTMLInputElement
          ).value.trim();
          update("search", val);
        }}
      >
        <input
          name="q"
          defaultValue={search}
          placeholder="Search name / email…"
          className="text-sm border rounded-lg px-3 py-1.5 bg-background min-w-[200px]"
        />
        <button
          type="submit"
          className="text-sm px-3 py-1.5 rounded-lg bg-primary text-primary-foreground"
        >
          Search
        </button>
      </form>
    </div>
  );
}
