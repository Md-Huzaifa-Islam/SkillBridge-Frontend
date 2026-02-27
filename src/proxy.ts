import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRoles } from "./constants/roles";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://skillbridge-iota-ebon.vercel.app/api";

async function getSession(
  token: string,
): Promise<{ id: string; role: string; email: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  let isAuthenticated = false;
  let isAdmin = false;
  let isStudent = false;
  let isTutor = false;

  if (token) {
    const user = await getSession(token);
    if (user) {
      isAuthenticated = true;
      isAdmin = user.role === UserRoles.admin;
      isStudent = user.role === UserRoles.student;
      isTutor = user.role === UserRoles.tutor;
    }
  }

  const authRoutes = ["/login", "/register", "/verify", "/"];
  const publicRoutes = ["/tutors"];
  const isPublicRoute =
    authRoutes.includes(pathName) ||
    publicRoutes.some((r) => pathName.startsWith(r));

  // Not authenticated — allow public/auth routes, redirect others to login
  if (!isAuthenticated) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated — redirect away from auth-only pages to role dashboard
  if (isAuthenticated && authRoutes.includes(pathName)) {
    if (isStudent)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    if (isAdmin)
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    if (isTutor)
      return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
  }

  // Role isolation: prevent accessing another role's protected routes
  if (
    isStudent &&
    (pathName.startsWith("/admin-dashboard") ||
      pathName.startsWith("/tutor-dashboard"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    isAdmin &&
    (pathName.startsWith("/dashboard") ||
      pathName.startsWith("/tutor-dashboard"))
  ) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  if (
    isTutor &&
    (pathName.startsWith("/admin-dashboard") ||
      pathName.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/verify",
    "/tutors/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/tutor-dashboard",
    "/tutor-dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
  ],
};
