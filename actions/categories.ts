"use server";

import { Category, ApiResponse } from "@/types";
import { revalidateCategories } from "./revalidate";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("skill_bridge.session_token");
  return {
    "Content-Type": "application/json",
    Cookie: authCookie ? `${authCookie.name}=${authCookie.value}` : "",
  };
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300, tags: ["categories"] },
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Categories retrieved" : "Failed to fetch categories"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch categories",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createCategory(
  name: string,
): Promise<ApiResponse<Category>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name }),
      cache: "no-store",
    });

    const result = await response.json();
    const isSuccess = result.success ?? response.ok;
    if (isSuccess) {
      await revalidateCategories();
    }
    return {
      success: isSuccess,
      message:
        result.message ||
        (response.ok ? "Category created" : "Failed to create category"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create category",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    const isSuccess = result.success ?? response.ok;
    if (isSuccess) {
      await revalidateCategories();
    }
    return {
      success: isSuccess,
      message:
        result.message ||
        (response.ok ? "Category deleted" : "Failed to delete category"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete category",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
