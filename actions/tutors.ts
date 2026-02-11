"use server";

import { TutorProfile, PaginatedResponse, ApiResponse } from "@/types";
import { TutorFilters } from "@/types/forms";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getTutors(
  filters?: TutorFilters,
): Promise<ApiResponse<PaginatedResponse<TutorProfile>>> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.minRating)
      params.append("minRating", filters.minRating.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(`${API_URL}/tutors?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60, tags: ["tutors"] },
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Tutors retrieved" : "Failed to fetch tutors"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch tutors",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTutorById(
  id: string,
): Promise<ApiResponse<TutorProfile>> {
  try {
    const response = await fetch(`${API_URL}/tutors/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Tutor retrieved" : "Failed to fetch tutor"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch tutor",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getFeaturedTutors(): Promise<
  ApiResponse<TutorProfile[]>
> {
  try {
    const response = await fetch(`${API_URL}/tutors?featured=true&limit=6`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok
          ? "Featured tutors retrieved"
          : "Failed to fetch featured tutors"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch featured tutors",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
