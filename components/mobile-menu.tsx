"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/tutors"
              onClick={() => setIsOpen(false)}
              className="py-2"
            >
              Find Tutors
            </Link>
            {session?.user && userRole === UserRole.TEACHER && (
              <Link
                href="/tutor/dashboard"
                onClick={() => setIsOpen(false)}
                className="py-2"
              >
                My Dashboard
              </Link>
            )}
            {session?.user && userRole === UserRole.STUDENT && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="py-2"
              >
                My Dashboard
              </Link>
            )}
            {session?.user && userRole === UserRole.ADMIN && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="py-2"
              >
                Admin Panel
              </Link>
            )}
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="py-2"
                >
                  Profile
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
