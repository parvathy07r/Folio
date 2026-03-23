import NotesSidebar from "@/components/NotesSidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-base flex min-h-0">
      <NotesSidebar />
      <main className="flex-1 min-w-0 h-full min-h-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
