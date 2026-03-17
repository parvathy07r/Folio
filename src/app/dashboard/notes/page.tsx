"use client";

import { MOCK_NOTES } from "@/data/constants";
import Searchbar from "@/components/Searchbar";
import { useState } from "react";
import NoteCard from "@/components/noteCard";
import { Badge } from "@/components/ui/badge";

export default function NotesPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="min-h-screen p-10 overflow-y-auto flex flex-col gap-4">
      {/* heading */}
      <div className="flex items-center gap-3">
        <h2 className="font-playfair text-2xl font-bold text-text">
          All Notes
        </h2>
        <Badge
          variant="secondary"
          className="text-subtle bg-card border-none rounded-lg px-2 py-0.5 text-xs"
        >
          {MOCK_NOTES.length}
        </Badge>
      </div>
      {/* search bar */}
      <Searchbar search={search} setSearch={setSearch} />
      {/* notes list */}
      {MOCK_NOTES.length > 0 && (
        <div className="mb-10">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {MOCK_NOTES.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
