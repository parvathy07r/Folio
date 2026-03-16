import { timeAgo } from "@/utils";
import { Note } from "@/types";
import { NOTE_ACCENT_COLORS, TAG_COLORS } from "@/data/constants";

export default function NoteCard({ note }: { note: Note }) {
  const accent = NOTE_ACCENT_COLORS[note.color] ?? NOTE_ACCENT_COLORS[0];
  const tagColor = TAG_COLORS[note.tag] ?? "#cba6f7";

  return (
    <div className="bg-card border border-transparent hover:border-border rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl relative overflow-hidden">
      {/* Accent bar */}
      <div
        className="h-0.5 rounded-full mb-3 opacity-80"
        style={{ background: accent }}
      />
      {/* Title */}
      <p className="text-text font-playfair font-semibold text-base mb-1.5 truncate">
        {note.title}
      </p>
      {/* Content preview */}
      <p className="text-subtle text-sm leading-relaxed mb-3 line-clamp-2">
        {note.content || "Empty note"}
      </p>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: `${tagColor}22`, color: tagColor }}
        >
          {note.tag}
        </span>
        <span className="text-[11px] text-muted">
          {timeAgo(note.updatedAt)}
        </span>
      </div>
      {/* Pin indicator */}
      {note.pinned && (
        <span className="absolute top-3 right-3 text-purple text-xs">⊛</span>
      )}
    </div>
  );
}
