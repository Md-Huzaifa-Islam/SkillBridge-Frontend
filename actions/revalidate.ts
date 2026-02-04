"use server";

import { revalidatePath } from "next/cache";

export async function revalidateTutors() {
  revalidatePath("/tutors");
  revalidatePath("/");
}

export async function revalidateTutor(tutorId: string) {
  revalidatePath(`/tutors/${tutorId}`);
  revalidatePath("/tutors");
}

export async function revalidateCategories() {
  revalidatePath("/admin/categories");
  revalidatePath("/tutors");
  revalidatePath("/");
}

export async function revalidateBookings() {
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  revalidatePath("/tutor/dashboard");
  revalidatePath("/admin/bookings");
}

export async function revalidateUsers() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function revalidateTutorProfile() {
  revalidatePath("/tutor/profile");
  revalidatePath("/tutor/dashboard");
}

export async function revalidateTutorSessions() {
  revalidatePath("/tutor/dashboard");
}

export async function revalidateAdminData() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/bookings");
}

export async function revalidateDashboard(path?: string) {
  if (path) {
    revalidatePath(path);
  }
  revalidatePath("/dashboard");
  revalidatePath("/tutor/dashboard");
  revalidatePath("/admin");
}
