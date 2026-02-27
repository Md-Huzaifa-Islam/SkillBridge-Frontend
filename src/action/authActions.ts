"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import { env } from "@/env";
import { UserRoles } from "@/constants/roles";

const BACKEND_URL = env.BACKEND_URL;

// Returns { error } on failure; redirects server-side on success.
// redirect() must be called outside try/catch per Next.js requirements.
export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<{ error: string } | never> {
  let role = "";

  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return { error: error.message || "Login failed" };
    }
    // Backend returns { token, role } — no local JWT decode needed
    const { token, role: userRole } = (await res.json()) as {
      token: string;
      role: string;
    };
    role = userRole ?? "";

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch {
    return { error: "Login failed. Please try again." };
  }

  // Cookie is set — redirect server-side based on role.
  // No client-side push needed; no race condition possible.
  if (role === UserRoles.admin) redirect("/admin-dashboard");
  if (role === UserRoles.tutor) redirect("/tutor-dashboard");
  redirect("/dashboard");
}

export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }
  return res.json();
}

export async function verifyEmailAction(token: string) {
  const res = await fetch(`${BACKEND_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Verification failed");
  }
  return res.json();
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function updateProfileAction(name: string) {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Failed to update profile");
  }
  revalidatePath("/dashboard/profile");
  return res.json() as Promise<{
    user: { id: string; name: string; email: string; role: string };
  }>;
}
