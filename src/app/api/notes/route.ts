import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const res = await pool.query(
      "SELECT id, title, content, tag, color, pinned, user_id AS \"userId\", created_at AS \"createdAt\", updated_at AS \"updatedAt\" FROM notes WHERE user_id = $1 ORDER BY updated_at DESC",
      [1],
    );

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      content?: string;
      tag?: string | null;
      color?: number;
      pinned?: boolean;
      userId?: number;
    };

    const title = (body.title ?? "Untitled").trim();
    const content = body.content ?? "";
    const tag = body.tag ?? null;
    const color = body.color ?? 0;
    const pinned = body.pinned ?? false;
    const userId = body.userId ?? 1;

    const res = await pool.query(
      "INSERT INTO notes (title, content, tag, color, pinned, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, content, tag, color, pinned, user_id AS \"userId\", created_at AS \"createdAt\", updated_at AS \"updatedAt\"",
      [title, content, tag, color, pinned, userId],
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
