import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-base">
      <main className="h-full min-h-0">{children}</main>
    </div>
  );
}
