// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import { userServices } from "./services/userServices";
// import { UserRoles } from "./constants/roles";

// export async function proxy(request: NextRequest) {
//   const pathName = request.nextUrl.pathname;

//   let isAuthenticated = false;
//   let isAdmin = false;
//   let isStudent = false;
//   let isTeacher = false;
//   const { data } = get session data from backend
//   if (data) {
//     isAuthenticated = true;
//     isAdmin = data.user.role === UserRoles.admin;
//     isStudent = data.user.role === UserRoles.student;
//     isTeacher = data.user.role === UserRoles.tutor;
//   }
//   const authRoutes = ["/login", "/register", "/verify", "/"];
//   if (!isAuthenticated) {
//     if (authRoutes.includes(pathName)) {
//       return NextResponse.next();
//     }
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   if (isAuthenticated && authRoutes.includes(pathName)) {
//     if (isStudent) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }

//     if (isAdmin) {
//       return NextResponse.redirect(new URL("/admin-dashboard", request.url));
//     }

//     if (isTeacher) {
//       return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
//     }
//   }
//   if (
//     isStudent &&
//     (pathName.startsWith("/admin-dashboard") ||
//       pathName.startsWith("/tutor-dashboard"))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (
//     isAdmin &&
//     (pathName.startsWith("/dashboard") ||
//       pathName.startsWith("/tutor-dashboard"))
//   ) {
//     return NextResponse.redirect(new URL("/admin-dashboard", request.url));
//   }

//   if (
//     isTeacher &&
//     (pathName.startsWith("/admin-dashboard") ||
//       pathName.startsWith("/dashboard"))
//   ) {
//     return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard",
//     "/dashboard/:path*",
//     "/admin-dashboard",
//     "/admin-dashboard/:path*",
//     "/tutor-dashboard",
//     "/tutor-dashboard/:path*",
//     "/login",
//     "/register",
//     "/verify",
//     "/",
//   ],
// };
