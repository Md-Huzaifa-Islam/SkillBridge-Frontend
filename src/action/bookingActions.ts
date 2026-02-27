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

/**
 * Create a new booking.
 * @param data.tutor_profile_id - TutorProfile.id
 * @param data.available_id     - Available.id (the day slot selected)
 * @param data.date_str         - Date string "YYYY-MM-DD"
 * @param data.start_time       - Time string "HH:MM:SS"
 * @param data.end_time         - Time string "HH:MM:SS"
 */
export async function createBookingAction(data: {
  tutor_profile_id: string;
  available_id: string;
  date_str: string;
  start_time: string;
  end_time: string;
}) {
  const token = await getToken();
  const result = await apiFetch("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
  revalidatePath("/dashboard/bookings");
  return result;
}

/**
 * Update a booking's status.
 * - Tutor can mark "completed"
 * - Student can mark "cancelled"
 */
export async function updateBookingStatusAction(
  bookingId: string,
  status: "completed" | "cancelled",
) {
  const token = await getToken();
  const result = await apiFetch(`/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token,
  });
  revalidatePath("/dashboard/bookings");
  revalidatePath("/tutor-dashboard/sessions");
  return result;
}
