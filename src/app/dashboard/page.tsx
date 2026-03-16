"use client";

import { getDate, getGreeting } from "@/utils";
import { useState } from "react";
import NoteCard from "@/components/noteCard";
import { MOCK_NOTES } from "@/data/constants";
import Searchbar from "@/components/Searchbar";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const pinnedNotes = MOCK_NOTES.filter((n) => n.pinned);
  const recentNotes = [...MOCK_NOTES]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen p-10 overflow-y-auto">
      {/* header */}
      <div className="mb-10">
        <p className="text-subtle text-sm mb-2">{getDate()}</p>
        {/* note: dynamically rende the user name  */}
        <h1 className="font-playfair text-4xl font-bold text-text leading-tight">
          {getGreeting()}, Alex ✦
        </h1>
        <p className="text-subtle text-base mt-2">
          {MOCK_NOTES.length} notes in your workspace
        </p>
      </div>

      {/* search */}
      <Searchbar search={search} setSearch={setSearch} />

      {/* pinned */}
      {pinnedNotes.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest text-subtle uppercase mb-3">
            Pinned
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {/* recent */}
      <div>
        <p className="text-xs font-bold tracking-widest text-subtle uppercase mb-3">
          Recent
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {recentNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}
