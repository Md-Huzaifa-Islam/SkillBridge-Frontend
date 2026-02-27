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

export async function createCategoryAction(name: string) {
  const token = await getToken();
  const result = await apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
    token,
  });
  revalidatePath("/admin-dashboard/categories");
  revalidatePath("/tutors");
  return result;
}

export async function updateCategoryAction(id: string, name: string) {
  const token = await getToken();
  const result = await apiFetch(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    token,
  });
  revalidatePath("/admin-dashboard/categories");
  return result;
}

export async function deleteCategoryAction(id: string) {
  const token = await getToken();
  const result = await apiFetch(`/categories/${id}`, {
    method: "DELETE",
    token,
  });
  revalidatePath("/admin-dashboard/categories");
  return result;
}
