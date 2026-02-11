import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("skill_bridge.session_token");

    if (!authCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
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
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const result = await response.json();
    const userData = result.data || result;
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
