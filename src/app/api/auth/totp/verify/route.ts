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
      "SELECT totp_secret FROM users WHERE id = $1",
      [session.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const secret = result.rows[0].totp_secret;

    if (!secret) {
      return NextResponse.json(
        { error: "TOTP not set up. Please scan QR code first." },
        { status: 400 }
      );
    }

    const isValid = verifyTOTPCode(code, secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid code. Please try again." },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE users SET totp_enabled = TRUE WHERE id = $1",
      [session.userId]
    );

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication enabled successfully!",
    });
  } catch (error) {
    console.error("TOTP verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify TOTP" },
      { status: 500 }
    );
  }
}
