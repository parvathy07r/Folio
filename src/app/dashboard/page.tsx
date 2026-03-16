"use client";

import { getDate, getGreeting } from "@/utils";
import { useState } from "react";
import NoteCard from "@/components/noteCard";
import { MOCK_NOTES } from "@/data/constants";

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
      <div className="relative mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute w-4 h-4 top-1/2 -translate-y-1/2 left-3.5 text-subtle"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
          />
        </svg>
        <input
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-text text-sm placeholder:text-muted focus:outline-none focus:border-purple transition-colors"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
