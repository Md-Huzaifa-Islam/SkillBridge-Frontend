import { Navbar } from "@/components/navbar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur border-b">
        <Navbar />
      </nav>
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
}
