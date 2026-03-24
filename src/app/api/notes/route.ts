

import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// --------------------
// GET /api/notes
// Returns all notes for the user
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, content, tag, color, pinned, user_id AS "userId" created_at AS "createdAt" updated_at AS "updatedAt" FROM notes WHERE user_id = $1 ORDER BY updated_at DESC`,
      [1]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
