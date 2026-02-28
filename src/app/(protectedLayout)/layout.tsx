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

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar role={session.user.role} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-1 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-xs">
                S
              </span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              SkillBridge
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs text-muted-foreground px-2.5 py-1 bg-muted rounded-full font-medium capitalize">
              {session.user.role}
            </span>
            <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[160px]">
              {session.user.email}
            </span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
