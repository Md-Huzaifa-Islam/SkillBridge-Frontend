"use server";

import { TutorProfile, Booking, ApiResponse } from "@/types";
import {
  UpdateTutorProfileInput,
  UpdateAvailabilityInput,
} from "@/types/forms";
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

export async function getTutorProfile(): Promise<ApiResponse<TutorProfile>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tutor/profile`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch tutor profile",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateTutorProfile(
  data: UpdateTutorProfileInput,
): Promise<ApiResponse<TutorProfile>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tutor/profile`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to update tutor profile",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateTutorAvailability(
  data: UpdateAvailabilityInput,
): Promise<ApiResponse<void>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tutor/availability`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to update availability",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTutorSessions(): Promise<ApiResponse<Booking[]>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tutor/sessions`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch sessions",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
