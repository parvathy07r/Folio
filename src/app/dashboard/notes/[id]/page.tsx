import { pool } from "@/lib/db";

export default async function NotePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const noteId = Number(id);

  if (!Number.isFinite(noteId)) {
    return (
      <div className="h-full flex items-center justify-center text-subtle">
        Invalid note id
      </div>
    );
  }

  const res = await pool.query(
    "SELECT id, title, content, tag, color, pinned, user_id AS \"userId\", created_at AS \"createdAt\", updated_at AS \"updatedAt\" FROM notes WHERE id = $1 AND user_id = $2",
    [noteId, 1],
  );

  const note = res.rows[0] as
    | {
        id: number;
        title: string;
        content: string;
        tag: string | null;
        color: number;
        pinned: boolean;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
      }
    | undefined;

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-subtle">
        Note not found
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="min-w-0">
          <h1 className="font-playfair text-xl font-bold text-text truncate">
            {note.title}
          </h1>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="whitespace-pre-wrap text-text leading-relaxed">
          {note.content || "Empty note"}
        </div>
      </div>
    </div>
  );
}
