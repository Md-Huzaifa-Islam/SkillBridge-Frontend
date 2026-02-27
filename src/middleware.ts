import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRoles } from "./constants/roles";

function decodeJwtPayload(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64url").toString("utf-8");
    return JSON.parse(payload) as {
      id: string;
      role: string;
      email: string;
      exp: number;
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  let isAuthenticated = false;
  let isAdmin = false;
  let isStudent = false;
  let isTutor = false;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && payload.exp * 1000 > Date.now()) {
      isAuthenticated = true;
      isAdmin = payload.role === UserRoles.admin;
      isStudent = payload.role === UserRoles.student;
      isTutor = payload.role === UserRoles.tutor;
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
