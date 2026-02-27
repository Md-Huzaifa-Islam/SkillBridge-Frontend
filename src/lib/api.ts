/**
 * Server-side API helpers — always pass the auth token from cookies.
 * Import getToken from lib/auth in server components / server actions.
 */

const BASE = process.env.BACKEND_URL || "http://localhost:5000/api";

async function req<T>(
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
    cache: (rest.cache as RequestCache) ?? "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const apiMe = (token: string) =>
  req<{ user: { id: string; name: string; email: string; role: string } }>("/auth/me", { token });

// ─── Tutors ──────────────────────────────────────────────────────────────────
export const apiGetTutors = (query = "", revalidate = 60) =>
  req<{ data: TutorCard[]; meta: PaginationMeta }>(`/tutors${query ? `?${query}` : ""}`, {
    next: { revalidate },
  });

export const apiGetTutor = (id: string) =>
  req<{ data: TutorDetail }>(`/tutors/${id}`, { next: { revalidate: 60 } });

export const apiGetMyTutorProfile = (token: string) =>
  req<{ data: TutorDetail }>("/tutors/me", { token });

export const apiGetTutorRatings = (id: string, token: string) =>
  req<{ data: Review[] }>(`/tutors/rating/${id}`, { token });

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const apiGetBookings = (token: string) =>
  req<{ data: Booking[] }>("/bookings", { token });

export const apiGetBooking = (id: string, token: string) =>
  req<{ data: Booking }>(`/bookings/${id}`, { token });

// ─── Categories ───────────────────────────────────────────────────────────────
export const apiGetCategories = () =>
  req<{ data: Category[] }>("/categories", { next: { revalidate: 300 } });

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const apiGetReviews = (tutorId: string, token: string) =>
  req<{ data: Review[] }>(`/reviews/${tutorId}`, { token });

// ─── Types ────────────────────────────────────────────────────────────────────
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TutorCard = {
  id: string;
  bio: string;
  hourlyRate: number;
  subjects: string[];
  userId: string;
  user: { id: string; name: string; email: string };
  category?: { id: string; name: string };
  averageRating?: number;
  totalReviews?: number;
};

export type TutorDetail = TutorCard & {
  availableSlots?: AvailableSlot[];
  reviews?: Review[];
};

export type AvailableSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export type Booking = {
  id: string;
  studentId: string;
  tutorId: string;
  slotId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalPrice: number;
  createdAt: string;
  tutor?: TutorCard;
  student?: { id: string; name: string; email: string };
  slot?: AvailableSlot;
};

export type Category = {
  id: string;
  name: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  studentId: string;
  tutorId: string;
  student?: { name: string };
  createdAt: string;
};
