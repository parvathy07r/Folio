"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@/components/editor";
import type { Note } from "@/types";

export default function NoteEditorPage() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContent = useRef<string | null>(null);
  const titleSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const idParam = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    fetch(`/api/notes/${idParam}`)
      .then((r) => r.json())
      .then(setNote);
  }, [idParam]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (titleSaveTimer.current) clearTimeout(titleSaveTimer.current);
      if (latestContent.current !== null) {
        navigator.sendBeacon(
          `/api/notes/${idParam}`,
          new Blob([JSON.stringify({ content: latestContent.current })], {
            type: "application/json",
          }),
        );
      }
    };
  }, [idParam]);

  const handleTitleChange = (value: string) => {
    setNote((prev) => (prev ? { ...prev, title: value } : prev));

    const numericId = note?.id ?? Number(idParam);
    if (Number.isFinite(numericId)) {
      window.dispatchEvent(
        new CustomEvent("note:title-updated", {
          detail: { id: numericId, title: value },
        }),
      );
    }

    if (titleSaveTimer.current) clearTimeout(titleSaveTimer.current);
    titleSaveTimer.current = setTimeout(async () => {
      await fetch(`/api/notes/${idParam}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value }),
      });
    }, 300);
  };

  const handleSave = (content: string) => {
    latestContent.current = content;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/notes/${idParam}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      latestContent.current = null;
    }, 800);
  };

  if (!note) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <input
        value={note.title}
        className="text-4xl font-bold bg-transparent border-none outline-none text-foreground px-16 pt-16 pb-2"
        placeholder="Untitled"
        onChange={(e) => handleTitleChange(e.target.value)}
      />

      <Editor
        key={note.id}
        initialContent={note.content ?? ""}
        onChange={handleSave}
      />
    </div>
  );
}
