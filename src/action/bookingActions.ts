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

export async function createBookingAction(data: {
  tutorId: string;
  slotId: string;
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

export async function updateBookingStatusAction(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED",
) {
  const token = await getToken();
  const result = await apiFetch(`/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token,
  });
  revalidatePath("/dashboard/bookings");
  revalidatePath("/tutor-dashboard");
  return result;
}
