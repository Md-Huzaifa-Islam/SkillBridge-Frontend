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
  req<{ user: { id: string; name: string; email: string; role: string } }>(
    "/auth/me",
    { token },
  );

// ─── Tutors ──────────────────────────────────────────────────────────────────

/** GET /tutors?category=&search=&page=&size= */
export const apiGetTutors = (query = "", revalidate = 60) =>
  req<{ data: TutorProfile[]; total: number; pages: number }>(
    `/tutors${query ? `?${query}` : ""}`,
    { next: { revalidate } },
  );

/** GET /tutors/:id  (public) */
export const apiGetTutor = (id: string) =>
  req<{ data: TutorProfile }>(`/tutors/${id}`, { next: { revalidate: 60 } });

/** GET /tutors/me  (tutor only) */
export const apiGetMyTutorProfile = (token: string) =>
  req<{ data: TutorProfile }>("/tutors/me", { token });

/** GET /tutors/rating/:id  (any role — reviews for a tutor profile) */
export const apiGetTutorRatings = (tutorProfileId: string, token?: string) =>
  req<{ data: TutorRating[] }>(`/tutors/rating/${tutorProfileId}`, {
    token,
    next: { revalidate: 60 },
  });

// ─── Bookings ─────────────────────────────────────────────────────────────────

/** GET /bookings  (student | tutor) */
export const apiGetBookings = (token: string) =>
  req<{ data: Booking[] }>("/bookings", { token });

/** GET /bookings/:id  (student | tutor) */
export const apiGetBooking = (id: string, token: string) =>
  req<{ data: Booking }>(`/bookings/${id}`, { token });

// ─── Categories ───────────────────────────────────────────────────────────────

/** GET /categories  (public) */
export const apiGetCategories = () =>
  req<{ data: Category[] }>("/categories", { next: { revalidate: 300 } });

// ─── Reviews ──────────────────────────────────────────────────────────────────

/** GET /reviews/:bookingId  (get reviews for a specific booking) */
export const apiGetBookingReviews = (bookingId: string, token: string) =>
  req<{ data: ReviewResult[] }>(`/reviews/${bookingId}`, { token });

// ─── Types ────────────────────────────────────────────────────────────────────

/** WeekDay enum values from Prisma schema */
export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** Available day slot for a tutor */
export type Available = {
  id: string;
  day: WeekDay;
  tutorId: string; // TutorProfile.id
};

/** TutorProfile as returned by GET /tutors/:id and GET /tutors/me */
export type TutorProfile = {
  id: string;
  title: string;
  description?: string;
  pricePerHour: number;
  /** ISO date string stored as time, e.g. "1970-01-01T09:00:00.000Z" */
  startTime: string;
  /** ISO date string stored as time */
  endTime: string;
  active: boolean;
  categoryId: string;
  userId: string;
  user: { id: string; name: string; email: string };
  category?: { id: string; name: string };
  availabilities?: Available[];
  avgRating?: number;
};

/** Booking status enum values (lowercase, matching Prisma map) */
export type BookingStatus = "confirmed" | "completed" | "cancelled";

/** Booking as returned by GET /bookings and GET /bookings/:id */
export type Booking = {
  id: string;
  tutorId: string; // TutorProfile.id
  studentId: string; // User.id
  availableId: string;
  /** ISO date string */
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  /** Populated when backend includes relation */
  tutor?: {
    id: string;
    title: string;
    description?: string;
    user: { id: string; name: string; email: string };
    category?: { id: string; name: string };
  };
  student?: { id: string; name: string; email: string };
  available?: { id: string; day: WeekDay };
  reviews?: { id: string; rating: number; review?: string }[];
};

export type Category = {
  id: string;
  name: string;
};

/** Review as returned by GET /reviews/:bookingId */
export type ReviewResult = {
  id: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  student?: { id: string; name: string };
  reviews?: {
    id: string;
    review?: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
  }[];
};

/** Rating entry returned by GET /tutors/rating/:tutorProfileId */
export type TutorRating = {
  id: string;
  rating: number;
  review?: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: {
    student: { name: string; email: string; image?: string | null };
  };
};
