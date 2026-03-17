import { timeAgo } from "@/utils";
import { Note } from "@/types";
import { NOTE_ACCENT_COLORS, TAG_COLORS } from "@/data/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pin } from "lucide-react";

export default function NoteCard({ note }: { note: Note }) {
  const accent = NOTE_ACCENT_COLORS[note.color] ?? NOTE_ACCENT_COLORS[0];
  const tagColor = TAG_COLORS[note.tag] ?? "#cba6f7";

  return (
    <Card className="border-transparent hover:border-border rounded-2xl p-4 gap-0 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl relative overflow-hidden ring-0">
      {/* Accent bar */}
      <div
        className="h-0.5 rounded-full mb-3 opacity-80"
        style={{ background: accent }}
      />
      <CardContent className="p-0 space-y-1.5">
        {/* Title */}
        <p className="text-text font-playfair font-semibold text-base truncate">
          {note.title}
        </p>
        {/* Content preview */}
        <p className="text-subtle text-sm leading-relaxed line-clamp-2">
          {note.content || "Empty note"}
        </p>
      </CardContent>
      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-0">
        <Badge
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-wider rounded-full h-auto px-2.5 py-1 border-none"
          style={{ background: `${tagColor}22`, color: tagColor }}
        >
          {note.tag}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {timeAgo(note.updatedAt)}
        </span>
      </div>
      {/* Pin indicator */}
      {note.pinned && (
        <Pin className="absolute top-3 right-3 size-3.5 text-purple fill-purple" />
      )}
    </Card>
  );
}
