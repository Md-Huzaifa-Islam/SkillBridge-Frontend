"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function revalidateTutors() {
  revalidateTag("tutors");
}

export async function revalidateTutor(tutorId: string) {
  revalidateTag(`tutor-${tutorId}`);
  revalidateTag("tutors");
}

export async function revalidateCategories() {
  revalidateTag("categories");
}

export async function revalidateBookings() {
  revalidateTag("bookings");
}

export async function revalidateUsers() {
  revalidateTag("users");
  revalidateTag("admin");
}

export async function revalidateTutorProfile() {
  revalidateTag("tutor-profile");
}

export async function revalidateTutorSessions() {
  revalidateTag("tutor-sessions");
}

export async function revalidateAdminData() {
  revalidateTag("admin");
  revalidateTag("users");
  revalidateTag("bookings");
}

export async function revalidateDashboard(path?: string) {
  if (path) {
    revalidatePath(path);
  }
  revalidatePath("/dashboard");
  revalidatePath("/tutor/dashboard");
  revalidatePath("/admin");
}
