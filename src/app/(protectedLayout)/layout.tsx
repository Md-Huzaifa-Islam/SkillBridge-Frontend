import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-changer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : session.user.email.slice(0, 2).toUpperCase();

  return (
    <SidebarProvider>
      <AppSidebar role={session.user.role} />
      <SidebarInset>
        {/* ── Top bar ── */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-1 data-[orientation=vertical]:h-4"
          />

          {/* Page breadcrumb anchor (just the brand on small, nothing extra) */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/icon.png"
              alt="SkillBridge"
              className="h-6 w-6 dark:invert shrink-0"
            />
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              SkillBridge
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Role badge */}
            <span className="hidden sm:inline-block text-xs text-muted-foreground px-2.5 py-1 bg-muted rounded-full font-medium capitalize">
              {session.user.role}
            </span>

            {/* Theme toggle */}
            <ModeToggle />

            {/* User avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-border/60 ml-1">
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/30 to-violet-500/30 flex items-center justify-center text-xs font-bold text-primary ring-2 ring-primary/10 shrink-0">
                {initials}
              </div>
              <div className="hidden md:block min-w-0">
                {session.user.name && (
                  <p className="text-sm font-medium leading-none truncate max-w-30">
                    {session.user.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate max-w-35">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex flex-1 flex-col gap-4 p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
