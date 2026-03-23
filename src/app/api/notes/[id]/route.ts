import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: Context) {
  const { id } = await context.params;
  const noteId = Number(id);
  if (!Number.isFinite(noteId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      'SELECT id, title, content, tag, color, pinned, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt" FROM notes WHERE id = $1 AND user_id = $2 LIMIT 1',
      [noteId, 1],
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  const { id } = await context.params;
  const noteId = Number(id);
  if (!Number.isFinite(noteId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = (await req.json()) as {
      title?: string;
      content?: string;
      tag?: string | null;
      color?: number;
      pinned?: boolean;
    };

    const fields: string[] = [];
    const values: unknown[] = [];

    const push = (sql: string, value: unknown) => {
      values.push(value);
      fields.push(`${sql} = $${values.length}`);
    };

    if (typeof body.title === "string") push("title", body.title.trim());
    if (typeof body.content === "string") push("content", body.content);
    if (body.tag === null || typeof body.tag === "string")
      push("tag", body.tag);
    if (typeof body.color === "number") push("color", body.color);
    if (typeof body.pinned === "boolean") push("pinned", body.pinned);

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    values.push(noteId);
    values.push(1);

    const res = await pool.query(
      `UPDATE notes SET ${fields.join(", ")} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING id, title, content, tag, color, pinned, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"`,
      values,
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: Context) {
  const { id } = await context.params;
  const noteId = Number(id);
  if (!Number.isFinite(noteId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2",
      [noteId, 1],
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
