"use client";

import NotesSidebar from "@/components/NotesSidebar";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="h-full min-h-0 flex bg-base">
     

      <main className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="min-w-0">
            <h1 className="font-playfair text-xl font-bold text-text truncate">
              Notes
            </h1>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          <div className="h-full flex items-center justify-center text-subtle">
            Select a note, or create a new one.
          </div>
        </div>
      </main>
    </div>
  );
}
