import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("skill_bridge.session_token");

    if (authCookie) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${authCookie.name}=${authCookie.value}`,
          },
        });
      } catch (e) {
        console.error("Backend logout failed:", e);
      }
    }

    cookieStore.delete("skill_bridge.session_token");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 },
    );
  }
}
