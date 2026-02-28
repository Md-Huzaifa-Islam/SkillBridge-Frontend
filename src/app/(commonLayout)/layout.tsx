import { Navbar } from "@/components/navbar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <nav className="fixed w-full top-0 z-50 left-1/2 -translate-x-1/2 bg-background/75 backdrop-blur-xl border-b border-border/50 shadow-sm mx-auto container">
        <Navbar />
      </nav>
      <div className="container mx-auto px-4 pb-10">{children}</div>
    </div>
  );
}
