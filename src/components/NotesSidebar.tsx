"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Note } from "@/types";
import { MOCK_NOTES } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  PanelLeft,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  LogOut,
} from "lucide-react";
import { getAvatar } from "@/utils";

export default function NotesSidebar() {
  const name = "John Doe";
  const [collapsed, setCollapsed] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(
    MOCK_NOTES[0]?.id ?? null,
  );

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  useEffect(() => {
    if (openMenuFor === null) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (menuRef.current?.contains(target)) return;
      if (menuTriggerRef.current?.contains(target)) return;

      setOpenMenuFor(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenuFor]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      return (
        n.title.toLowerCase().includes(q) ||
        (n.content ?? "").toLowerCase().includes(q)
      );
    });
  }, [notes, search]);

  const onSelectNote = (id: number) => {
    setActiveNoteId(id);
  };

  const onCreateNote = () => {
    const nextId = notes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
    const now = new Date();
    const newNote: Note = {
      id: nextId,
      title: "Untitled",
      content: "",
      tag: "personal",
      color: 0,
      pinned: false,
      createdAt: now,
      updatedAt: now,
      userId: 1,
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const onDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setOpenMenuFor(null);
    setActiveNoteId((prev) => (prev === id ? null : prev));
  };

  return (
    <aside
      className={
        "h-full bg-sidebar border-r border-border flex flex-col flex-shrink-0 " +
        (collapsed ? "w-[56px]" : "w-[300px]")
      }
    >
      {/* header */}
      <div
        className={
          "flex items-center px-6 py-6 " +
          (collapsed ? "justify-center" : "justify-between")
        }
      >
        {!collapsed && <span className="text-lg font-semibold">Folio</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-xl text-subtext hover:text-text cursor-pointer"
        >
          <PanelLeft className="size-4" />
        </Button>
      </div>

      {/* actions */}
      {!collapsed && (
        <div className="px-2 pb-2">
          <Button
            onClick={onCreateNote}
            variant="ghost"
            className="w-full cursor-pointer justify-start items-center gap-3 px-3 py-3 h-auto rounded-xl text-left text-subtext hover:bg-card hover:text-text"
          >
            <Plus className="size-4" />
            New note
          </Button>

          <Button
            variant="ghost"
            className="w-full cursor-pointer justify-start items-center gap-3 px-3 py-3 h-auto rounded-xl text-left text-subtext hover:bg-card hover:text-text"
          >
            <Search className="size-4" />
            Search
          </Button>
        </div>
      )}

      {/* content */}
      <div
        className={
          "flex-1 overflow-y-auto " + (collapsed ? "py-2" : "py-2 px-2")
        }
      >
        {!collapsed && (
          <>
            <div className="px-2 py-2">
              <p className="text-xs text-subtle font-semibold">Recents</p>
            </div>

            {filteredNotes.map((note) => {
              const active = note.id === activeNoteId;

              return (
                <div key={note.id} className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => onSelectNote(note.id)}
                    className={
                      "w-full justify-start cursor-pointer items-center gap-3 px-2 py-2 h-auto rounded-xl text-left group " +
                      (active
                        ? "bg-card text-text"
                        : "text-subtext hover:bg-card hover:text-text")
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {note.title}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer size-8 rounded-lg opacity-0 group-hover:opacity-100 text-subtle hover:text-text"
                      ref={openMenuFor === note.id ? menuTriggerRef : null}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuFor((prev) =>
                          prev === note.id ? null : note.id,
                        );
                      }}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </Button>

                  {openMenuFor === note.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-2 top-12 z-20 w-44 rounded-xl bg-card border border-border shadow-xl overflow-hidden"
                    >
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-rose hover:bg-accent flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-between items-center gap-3 px-3 py-3 h-auto rounded-xl text-left"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-9 rounded-full bg-card border border-border flex items-center justify-center text-xs font-semibold text-text flex-shrink-0">
              {getAvatar(name)}
            </div>
            <p className="text-sm font-semibold truncate">{name}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-8 rounded-lg text-subtle hover:text-text"
            onClick={() => {
              handleLogout();
            }}
            aria-label="Logout"
          >
            <LogOut className="size-4" />
          </Button>
        </Button>
      </div>
    </aside>
  );
}
