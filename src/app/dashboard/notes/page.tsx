"use client";

import { MOCK_NOTES } from "@/data/constants";
import Searchbar from "@/components/Searchbar";
import { useState } from "react";
import NoteCard from "@/components/noteCard";

export default function NotesPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="min-h-screen p-10 overflow-y-auto flex flex-col gap-4">
      {/* heading */}
      <div className="flex gap-2">
        <div>All Notes</div>
        <div>{MOCK_NOTES.length}</div>
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
