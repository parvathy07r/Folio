import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { verifyTOTPCode } from "@/lib/totp";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT totp_secret, totp_enabled FROM users WHERE id = $1",
      [session.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { totp_secret, totp_enabled } = result.rows[0];

    if (!totp_enabled) {
      return NextResponse.json(
        { error: "2FA is not enabled" },
        { status: 400 }
      );
    }

    const isValid = verifyTOTPCode(code, totp_secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid code. Please try again." },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE users SET totp_enabled = FALSE, totp_secret = NULL WHERE id = $1",
      [session.userId]
    );

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication disabled successfully!",
    });
  } catch (error) {
    console.error("TOTP disable error:", error);
    return NextResponse.json(
      { error: "Failed to disable TOTP" },
      { status: 500 }
    );
  }
}
