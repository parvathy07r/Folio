import Sidebar from "@/components/sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
    </div>
  );
}
