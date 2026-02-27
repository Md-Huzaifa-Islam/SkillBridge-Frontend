"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "@/lib/auth";

const BASE = process.env.BACKEND_URL || "http://localhost:5000/api";

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function createTutorProfileAction(data: {
  bio: string;
  hourlyRate: number;
  subjects: string[];
  categoryId?: string;
}) {
  const token = await getToken();
  const result = await apiFetch("/tutors", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
  revalidatePath("/tutor-dashboard");
  revalidatePath("/tutors");
  return result;
}

export async function updateTutorProfileAction(data: {
  bio?: string;
  hourlyRate?: number;
  subjects?: string[];
  categoryId?: string;
}) {
  const token = await getToken();
  const result = await apiFetch("/tutors/me", {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
  revalidatePath("/tutor-dashboard");
  revalidatePath("/tutors");
  return result;
}

export async function toggleTutorAvailableAction() {
  const token = await getToken();
  const result = await apiFetch("/tutors/active/me", {
    method: "PATCH",
    token,
  });
  revalidatePath("/tutor-dashboard");
  return result;
}

export async function updateSlotAction(
  slotId: string,
  data: {
    date?: string;
    startTime?: string;
    endTime?: string;
    isBooked?: boolean;
  },
) {
  const token = await getToken();
  const result = await apiFetch(`/tutors/slot/${slotId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
  revalidatePath("/tutor-dashboard/availability");
  return result;
}
