import * as React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/action/authActions";
import { UserRoles } from "@/constants/roles";
import { ActiveNavMenu } from "@/components/active-nav-menu";

// Intentionally kept as a server component — receives role as prop from layout
export function AppSidebar({ role = UserRoles.student }: { role?: string }) {
  const label =
    role === UserRoles.tutor
      ? "Tutor Panel"
      : role === UserRoles.admin
        ? "Admin Panel"
        : "Student Panel";

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/icon.png"
            alt="SkillBridge"
            className="h-8 w-8 dark:invert"
          />
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
            <ActiveNavMenu role={role} />
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
