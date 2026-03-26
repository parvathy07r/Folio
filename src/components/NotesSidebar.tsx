"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Note } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  LogOut,
  NotebookPen,
} from "lucide-react";
import { getAvatar } from "@/utils";

function getLexicalPreview(content: string): string {
  if (!content) return "";

  try {
    const parsed = JSON.parse(content);

    const texts: string[] = [];

    for (const block of parsed.root.children) {
      for (const child of block.children) {
        if (child.type === "text" && child.text) {
          texts.push(child.text);
        }
      }
    }

    return texts.join(" ").trim();
  } catch {
    return content;
  }
}

export default function NotesSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const name = "John Doe";
  const [collapsed, setCollapsed] = useState(true);
  const [search] = useState("");
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: number; title: string }>).detail;
      if (!detail) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === detail.id ? { ...n, title: detail.title } : n,
        ),
      );
    };

    window.addEventListener("note:title-updated", handler);
    return () => window.removeEventListener("note:title-updated", handler);
  }, []);

  const fetchNotes = useCallback(async () => {
    const response = await fetch("/api/notes");
    const data = await response.json();
    setNotes(data);
    if (data.length > 0) {
      setActiveNoteId((prev) => (prev === null ? data[0].id : prev));
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const match = pathname.match(/^\/dashboard\/notes\/(\d+)$/);
    if (!match) return;
    const id = Number(match[1]);
    if (Number.isNaN(id)) return;
    setActiveNoteId(id);
  }, [pathname]);

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

  const notePreviewById = useMemo(() => {
    const map = new Map<number, string>();
    for (const note of filteredNotes) {
      const previewRaw = getLexicalPreview(note.content ?? "");
      const preview =
        previewRaw.length > 60 ? `${previewRaw.slice(0, 60)}…` : previewRaw;
      map.set(note.id, preview);
    }
    return map;
  }, [filteredNotes]);

  const onSelectNote = useCallback(
    async (id: number) => {
      setActiveNoteId(id);
      try {
        router.push(`/dashboard/notes/${String(id)}`);
      } finally {
      }
    },
    [router],
  );

  const onDeleteNote = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: "DELETE",
        });
        await response.json();
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (activeNoteId === id) {
          setActiveNoteId(null);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [activeNoteId],
  );

  const onCreateNote = useCallback(async () => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled",
        content: "",
        tag: "personal",
        color: 0,
        pinned: false,
        userId: 1,
      }),
    });
    const data = await response.json();
    setNotes((prev) => [data, ...prev]);
    setActiveNoteId(data.id);
    router.push(`/dashboard/notes/${data.id}`);
  }, [router]);

  return (
    <aside
      className={
        "h-full bg-sidebar border-border flex flex-col flex-shrink-0 " +
        (collapsed ? "w-[56px]" : "w-[260px]")
      }
    >
      {/* header */}
      <div
        className={
          "flex items-center px-6 py-6 " +
          (collapsed ? "justify-center" : "justify-between")
        }
      >
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={
            "group flex items-center gap-3 rounded-xl cursor-pointer hover:bg-card px-2 py-2 -mx-2 " +
            (collapsed ? "justify-center" : "justify-start")
          }
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20 transition-transform group-hover:scale-[1.02]">
            <NotebookPen className="size-5 stroke-[1.8]" />
          </span>
          {!collapsed && (
            <div className="flex flex-col items-start leading-tight ">
              <span className="text-lg font-semibold text-text">Folio</span>
              <span className="text-[10px] tracking-widest text-subtle uppercase">
                Personal workspace
              </span>
            </div>
          )}
        </button>
      </div>

      {collapsed && (
        <div className="px-2 pb-2 ">
          <Button
            onClick={onCreateNote}
            variant="ghost"
            className="w-full cursor-pointer justify-center items-center gap-2 px-3 py-3 h-auto rounded-lg bg-transparent text-subtext hover:bg-transparent hover:text-text font-normal"
          >
            <Plus className="size-4 stroke-[1.5]" />
          </Button>
        </div>
      )}

      {/* actions */}
      {!collapsed && (
        <div className="px-2 pb-2">
          <Button
            onClick={onCreateNote}
            variant="ghost"
            className="w-full cursor-pointer justify-center items-center gap-2 px-3 py-3 h-auto rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-normal"
          >
            <Plus className="size-4 stroke-[1.5]" />
            New Note
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
              <p className="text-[10px] text-subtext">RECENT NOTES</p>
            </div>

            {filteredNotes.map((note) => {
              const active = note.id === activeNoteId;
              const preview = notePreviewById.get(note.id) ?? "";

              return (
                <div key={note.id} className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => onSelectNote(note.id)}
                    className={
                      "w-full justify-start cursor-pointer items-center px-3 py-3 h-auto rounded-xl text-left group " +
                      (active
                        ? "bg-card text-text"
                        : "text-subtext hover:bg-card hover:text-text")
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] text-text font-bold truncate">
                        {note.title}
                      </p>
                      {!!preview && (
                        <p className="text-[11px] text-subtext font-normal truncate">
                          {preview}
                        </p>
                      )}
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

      <div>
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-between items-center gap-3 px-3 py-3 h-auto rounded-xl text-left"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-9 rounded-full bg-card border border-border flex items-center justify-center text-xs font-semibold text-text flex-shrink-0">
              {getAvatar(name)}
            </div>
            {!collapsed && (
              <p className="text-sm font-semibold truncate">{name}</p>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer size-8 rounded-lg text-subtle hover:text-text"
              aria-label="Logout"
            >
              <LogOut className="size-4" />
            </Button>
          )}
        </Button>
      </div>
    </aside>
  );
}
