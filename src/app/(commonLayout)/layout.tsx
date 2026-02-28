import { Navbar } from "@/components/navbar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full top-0 z-50 left-1/2 -translate-x-1/2 bg-background/75 backdrop-blur-xl border-b border-border/50 shadow-sm mx-auto container">
        <Navbar />
      </nav>
      <main className="flex-1 container mx-auto px-4 pt-20 pb-10">
        {children}
      </main>
    </div>
  );
}
