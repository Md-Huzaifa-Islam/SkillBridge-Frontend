"use server";

import { Booking, ApiResponse } from "@/types";
import { CreateBookingInput } from "@/types/forms";
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

export async function createBooking(
  data: CreateBookingInput,
): Promise<ApiResponse<Booking>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Booking created" : "Failed to create booking"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create booking",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getBookings(): Promise<ApiResponse<Booking[]>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings`, {
      method: "GET",
      headers,
      next: { revalidate: 30, tags: ["bookings"] },
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Bookings retrieved" : "Failed to fetch bookings"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getBookingById(
  id: string,
): Promise<ApiResponse<Booking>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Booking retrieved" : "Failed to fetch booking"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch booking",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<ApiResponse<Booking>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    const result = await response.json();
    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok
          ? "Booking status updated"
          : "Failed to update booking status"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update booking status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
