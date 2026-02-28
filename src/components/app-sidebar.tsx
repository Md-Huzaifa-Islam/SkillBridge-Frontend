import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarCheck,
  ChartBar,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Star,
  User,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/action/authActions";
import { UserRoles } from "@/constants/roles";

type NavItem = { title: string; url: string; icon: React.ElementType };

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

function labelForRole(role: string) {
  if (role === UserRoles.tutor) return "Tutor Panel";
  if (role === UserRoles.admin) return "Admin Panel";
  return "Student Panel";
}

// Intentionally kept as a server component — receives role as prop from layout
export function AppSidebar({ role = UserRoles.student }: { role?: string }) {
  const navItems = navForRole(role);
  const label = labelForRole(role);

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-base tracking-tight">
            SkillBridge
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 py-2">
            {label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className="rounded-lg">
                    <Link href={item.url} className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t">
        <form action={logoutAction}>
          <SidebarMenuButton
            type="submit"
            className="w-full flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg font-medium"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// keep old dummy nav so nothing else breaks — remove after full migration
const _data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Build Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
  ],
};
