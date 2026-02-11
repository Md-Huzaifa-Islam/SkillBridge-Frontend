"use client";

import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  GraduationCap,
  Shield,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const userRole = user?.role as UserRole | undefined;
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      [UserRole.ADMIN]: {
        label: "Admin",
        className: "bg-red-100 text-red-700",
      },
      [UserRole.TEACHER]: {
        label: "Tutor",
        className: "bg-blue-100 text-blue-700",
      },
      [UserRole.STUDENT]: {
        label: "Student",
        className: "bg-green-100 text-green-700",
      },
    };
    return roleConfig[role] || roleConfig[UserRole.STUDENT];
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const NavLink = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-between py-3 px-4 text-foreground hover:bg-muted rounded-lg transition"
    >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        {children}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-muted rounded-lg transition"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!loading && isAuthenticated && user && (
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-blue-100 dark:border-blue-900">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-xs ${getRoleBadge(user.role).className}`}
                  >
                    {getRoleBadge(user.role).label}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <NavLink href="/tutors" icon={GraduationCap}>
                Find Tutors
              </NavLink>

              {isAuthenticated && userRole === UserRole.TEACHER && (
                <>
                  <NavLink href="/tutor/dashboard" icon={LayoutDashboard}>
                    My Dashboard
                  </NavLink>
                  <NavLink href="/tutor/profile" icon={User}>
                    My Profile
                  </NavLink>
                </>
              )}

              {isAuthenticated && userRole === UserRole.STUDENT && (
                <>
                  <NavLink href="/dashboard" icon={LayoutDashboard}>
                    My Dashboard
                  </NavLink>
                  <NavLink href="/dashboard/bookings" icon={BookOpen}>
                    My Bookings
                  </NavLink>
                </>
              )}

              {isAuthenticated && userRole === UserRole.ADMIN && (
                <NavLink href="/admin" icon={Shield}>
                  Admin Panel
                </NavLink>
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-muted/50">
            {loading ? (
              <div className="h-10 bg-muted animate-pulse rounded-lg" />
            ) : isAuthenticated ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
