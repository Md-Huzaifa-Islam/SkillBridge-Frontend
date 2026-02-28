"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  ChartBar,
  FolderOpen,
  LayoutDashboard,
  Star,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserRoles } from "@/constants/roles";

type NavItem = { title: string; url: string; icon: LucideIcon };

const studentNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Bookings", url: "/dashboard/bookings", icon: CalendarCheck },
  { title: "Browse Tutors", url: "/dashboard/tutors", icon: BookOpen },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const tutorNav: NavItem[] = [
  { title: "Dashboard", url: "/tutor-dashboard", icon: LayoutDashboard },
  {
    title: "Availability",
    url: "/tutor-dashboard/availability",
    icon: CalendarCheck,
  },
  { title: "My Sessions", url: "/tutor-dashboard/sessions", icon: BookOpen },
  { title: "Reviews", url: "/tutor-dashboard/reviews", icon: Star },
  { title: "Profile", url: "/tutor-dashboard/profile", icon: User },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", url: "/admin-dashboard", icon: ChartBar },
  { title: "Users", url: "/admin-dashboard/users", icon: Users },
  { title: "Bookings", url: "/admin-dashboard/bookings", icon: CalendarCheck },
  { title: "Categories", url: "/admin-dashboard/categories", icon: FolderOpen },
];

function navForRole(role: string): NavItem[] {
  if (role === UserRoles.tutor) return tutorNav;
  if (role === UserRoles.admin) return adminNav;
  return studentNav;
}

export function ActiveNavMenu({ role }: { role: string }) {
  const pathname = usePathname();
  const items = navForRole(role);

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          pathname === item.url ||
          (item.url !== "/" &&
            item.url.split("/").length > 2 &&
            pathname.startsWith(item.url));

        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className="rounded-lg"
            >
              <Link href={item.url} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
