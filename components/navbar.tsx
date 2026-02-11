"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import {
  User,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Shield,
  BookOpen,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const userRole = user?.role as UserRole | undefined;

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
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      [UserRole.TEACHER]: {
        label: "Tutor",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      [UserRole.STUDENT]: {
        label: "Student",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
    };
    return roleConfig[role] || roleConfig[UserRole.STUDENT];
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return "/admin";
      case UserRole.TEACHER:
        return "/tutor/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          🎓 SkillBridge
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/tutors"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition font-medium"
          >
            <GraduationCap className="h-4 w-4" />
            Find Tutors
          </Link>
          {isAuthenticated && userRole === UserRole.TEACHER && (
            <Link
              href="/tutor/dashboard"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition font-medium"
            >
              <LayoutDashboard className="h-4 w-4" />
              My Dashboard
            </Link>
          )}
          {isAuthenticated && userRole === UserRole.STUDENT && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition font-medium"
            >
              <LayoutDashboard className="h-4 w-4" />
              My Bookings
            </Link>
          )}
          {isAuthenticated && userRole === UserRole.ADMIN && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition font-medium"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
              <div className="hidden md:block h-5 w-20 bg-muted animate-pulse rounded" />
            </div>
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 py-1.5 h-auto"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-1.5 py-0 h-4 ${getRoleBadge(user.role).className}`}
                    >
                      {getRoleBadge(user.role).label}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {userRole === UserRole.TEACHER && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/tutor/profile"
                      className="flex items-center cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                {userRole === UserRole.STUDENT && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/bookings"
                      className="flex items-center cursor-pointer"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
