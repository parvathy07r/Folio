"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@/components/editor";
import type { Note } from "@/types";

export default function NoteEditorPage() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then((r) => r.json())
      .then(setNote);
  }, [id]);

  const handleSave = (content: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    }, 800);
  };

  if (!note) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <input
        defaultValue={note.title}
        className="text-4xl font-bold bg-transparent border-none outline-none text-foreground px-16 pt-16 pb-2"
        placeholder="Untitled"
        onBlur={(e) => {
          fetch(`/api/notes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: e.target.value }),
          });
        }}
      />

      <Editor
        key={note.id}
        initialContent={note.content ?? ""}
        onChange={handleSave}
      />
    </div>
  );
}