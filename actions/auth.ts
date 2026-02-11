"use server";

import { ApiResponse, User } from "@/types";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(
  data: RegisterInput,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    // Only set cookies if registration was successful
    if (response.ok && result.success) {
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        const cookieStore = await cookies();
        // Parse and set cookies
        const cookieParts = setCookieHeader.split(";")[0].split("=");
        if (cookieParts.length >= 2) {
          cookieStore.set(cookieParts[0], cookieParts.slice(1).join("="), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
      }
    }

    return {
      success: result.success ?? response.ok,
      message:
        result.message ||
        (response.ok ? "Registration successful" : "Registration failed"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to register",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function loginUser(data: LoginInput): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    // Only set cookies if login was successful
    if (response.ok && result.success) {
      const cookieStore = await cookies();

      // Use sessionToken from response body (more reliable than parsing Set-Cookie header)
      if (result.sessionToken) {
        cookieStore.set("skill_bridge.session_token", result.sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    return {
      success: result.success ?? response.ok,
      message:
        result.message || (response.ok ? "Login successful" : "Login failed"),
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to login",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("skill_bridge.session_token");

    if (!authCookie) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${authCookie.name}=${authCookie.value}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to get user",
      };
    }

    const result = await response.json();

    // Handle new response format with data property
    const userData = result.data || result;

    return {
      success: result.success ?? true,
      message: result.message || "User retrieved successfully",
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to get current user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function logoutUser(): Promise<ApiResponse<void>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("skill_bridge.session_token");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to logout",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
