"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

function decodeRole(token: string): string | null {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf-8"),
    );
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<{ token: string; role: string }> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }
  const json = await res.json();
  const { token } = json as { token: string };
  const role = decodeRole(token) ?? "";

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { token, role };
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
