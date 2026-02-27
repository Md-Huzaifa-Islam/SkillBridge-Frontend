"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "@/lib/auth";
import { env } from "@/env";

const BASE = env.BACKEND_URL;

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

/**
 * Create a new tutor profile. categoryId is REQUIRED by the backend.
 * @param data.start_time - "HH:MM:SS"
 * @param data.end_time   - "HH:MM:SS"
 */
export async function createTutorProfileAction(data: {
  title: string;
  description?: string;
  pricePerHour: number;
  start_time: string;
  end_time: string;
  categoryId: string;
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

/**
 * Update own tutor profile.
 * @param data.start_time - "HH:MM:SS" if updating
 * @param data.end_time   - "HH:MM:SS" if updating
 */
export async function updateTutorProfileAction(data: {
  title?: string;
  description?: string;
  pricePerHour?: number;
  start_time?: string;
  end_time?: string;
  active?: boolean;
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

/** Toggle active/inactive status of own tutor profile. */
export async function toggleTutorAvailableAction(active: boolean) {
  const token = await getToken();
  const result = await apiFetch("/tutors/active/me", {
    method: "PATCH",
    body: JSON.stringify({ active }),
    token,
  });
  revalidatePath("/tutor-dashboard");
  return result;
}

/**
 * Update available days for the tutor.
 * @param tutorProfileId - TutorProfile.id (used as :id in PATCH /tutors/slot/:id)
 * @param days           - Array of WeekDay strings, e.g. ["monday", "wednesday"]
 */
export async function updateSlotAction(tutorProfileId: string, days: string[]) {
  const token = await getToken();
  const result = await apiFetch(`/tutors/slot/${tutorProfileId}`, {
    method: "PATCH",
    body: JSON.stringify({ days }),
    token,
  });
  revalidatePath("/tutor-dashboard/availability");
  return result;
}
