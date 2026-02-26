import { Navbar } from "@/components/navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <nav className="fixed w-full top-0">
        <Navbar />
      </nav>
      {children}
    </div>
  );
}
