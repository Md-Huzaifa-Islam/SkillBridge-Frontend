"use server";

import { User, Booking, ApiResponse } from "@/types";
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

export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch users",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateUserStatus(userId: string, is_banned: boolean): Promise<ApiResponse<User>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_banned }),
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to update user status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAllBookings(): Promise<ApiResponse<Booking[]>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/bookings`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch all bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAdminStats(): Promise<ApiResponse<any>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/stats`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch stats",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
