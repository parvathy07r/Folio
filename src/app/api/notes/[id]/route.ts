import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: rawId } = await params; 
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        id, title, content, tag, color, pinned,
        user_id AS "userId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
       FROM notes
       WHERE id = $1 AND user_id = $2`,
      [id, 1]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id: rawId } = await params; 
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await pool.query("DELETE FROM notes WHERE id = $1", [id]);

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id: rawId } = await params; 
    const id = parseInt(rawId, 10);
    const body = await req.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE notes
       SET
         title      = COALESCE($1, title),
         content    = COALESCE($2, content),
         tag        = COALESCE($3, tag),
         color      = COALESCE($4, color),
         pinned     = COALESCE($5, pinned),
         updated_at = NOW()
       WHERE id = $6
       RETURNING
         id, title, content, tag, color, pinned,
         user_id AS "userId",
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [body.title ?? null, body.content ?? null, body.tag ?? null, body.color ?? null, body.pinned ?? null, id]
    );

    return NextResponse.json(result.rows[0]);

  } catch (err) {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  return PATCH(req, { params });
}