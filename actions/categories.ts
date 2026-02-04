"use server";

import { Category, ApiResponse } from "@/types";
import { revalidateCategories } from "./revalidate";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300, tags: ["categories"] },
    });

    const data = await response.json();
    return data;
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
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      cache: "no-store",
    });

    const data = await response.json();
    if (data.success) {
      await revalidateCategories();
    }
    return data;
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
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    if (data.success) {
      await revalidateCategories();
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete category",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
