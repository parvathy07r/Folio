import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateTOTPSecret, generateQRCode } from "@/lib/totp";

export async function POST() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = generateTOTPSecret();

    const userResult = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = userResult.rows[0].email;

    await pool.query(
      "UPDATE users SET totp_secret = $1, totp_enabled = FALSE WHERE id = $2",
      [secret, session.userId]
    );

    const qrCode = await generateQRCode(email, secret);

    return NextResponse.json({
      qrCode,
      secret,
      message: "Scan QR code with your authenticator app",
    });
  } catch (error) {
    console.error("TOTP setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup TOTP" },
      { status: 500 }
    );
  }
}
