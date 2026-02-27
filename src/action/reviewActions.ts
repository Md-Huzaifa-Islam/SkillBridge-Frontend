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
 * Create a review for a completed booking.
 * The booking must belong to the current student and have status "completed".
 * POST /reviews/:bookingId  with body { rating, review? }
 */
export async function createReviewAction(
  bookingId: string,
  data: { rating: number; review?: string },
) {
  const token = await getToken();
  const result = await apiFetch(`/reviews/${bookingId}`, {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
  revalidatePath("/dashboard/bookings");
  return result;
}

/**
 * Update an existing review.
 * PATCH /reviews/:reviewId  with body { rating?, review? }
 */
export async function updateReviewAction(
  reviewId: string,
  data: { rating?: number; review?: string },
) {
  const token = await getToken();
  const result = await apiFetch(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
  revalidatePath("/dashboard/bookings");
  return result;
}

/**
 * Delete a review.
 * DELETE /reviews/:reviewId
 */
export async function deleteReviewAction(reviewId: string) {
  const token = await getToken();
  const result = await apiFetch(`/reviews/${reviewId}`, {
    method: "DELETE",
    token,
  });
  revalidatePath("/dashboard/bookings");
  return result;
}
