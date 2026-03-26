import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

type RouteContext = { params: { id: string } };

// --------------------
// GET /api/notes
// Returns all notes for the user
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, content, tag, color, pinned, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt" FROM notes WHERE user_id = $1 ORDER BY updated_at DESC`,
      [1],
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

// --------------------
// POST /api/notes
// Creates a new note
// --------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = (body.title ?? "Untitled").trim();
    const content = body.content ?? "";
    const tag = body.tag ?? null;
    const color = body.color ?? 0;
    const pinned = body.pinned ?? false;
    const userId = 1;

    const result = await pool.query(
      `INSERT INTO notes (title, content, tag, color, pinned, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, content, tag, color, pinned, userId],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
