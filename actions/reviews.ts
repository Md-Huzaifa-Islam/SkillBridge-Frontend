"use server";

import { Rating, ApiResponse } from "@/types";
import { CreateReviewInput } from "@/types/forms";
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

export async function createReview(data: CreateReviewInput): Promise<ApiResponse<Rating>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to create review",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
