"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";

export function Navbar() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SkillBridge
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/tutors" className="hover:text-blue-600 transition">
            Find Tutors
          </Link>
          {session?.user && userRole === UserRole.TEACHER && (
            <Link
              href="/tutor/dashboard"
              className="hover:text-blue-600 transition"
            >
              My Dashboard
            </Link>
          )}
          {session?.user && userRole === UserRole.STUDENT && (
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              My Dashboard
            </Link>
          )}
          {session?.user && userRole === UserRole.ADMIN && (
            <Link href="/admin" className="hover:text-blue-600 transition">
              Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{session.user.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
