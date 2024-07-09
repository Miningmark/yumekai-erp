import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  const { token, password, name } = await req.json();

  if (name && !token && !password) {
    //Create Reset token
    try {
      const [rows] = await connection.execute("SELECT id, email FROM users WHERE name = ?", [name]);

      if (rows.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const user = rows[0];
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      await connection.execute(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
        [resetToken, resetTokenExpiry, user.id]
      );

      const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
      console.log("API URL E-MAIL", `${process.env.BASE_URL}/api/email`);
      const response = await fetch(`${process.env.BASE_URL}/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "system@miningmark.de",
          to: user.email,
          subject: "Password Reset Request",
          text: `Please click the following link to reset your password: ${resetUrl}`,
          auth: process.env.EMAIL_AUTH,
        }),
      });

      if (!response.ok) {
        return NextResponse.json(
          { message: "Internal server error by send E-Mail" },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
    } catch (error) {
      console.error("Error in reset-password API endpoint: ", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  } else if (token && password) {
    //reset password
    try {
      const [rows] = await connection.execute(
        "SELECT id, reset_token_expiry FROM users WHERE reset_token = ?",
        [token]
      );

      if (rows.length === 0) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
      }

      const user = rows[0];
      if (Date.now() > user.reset_token_expiry) {
        return NextResponse.json({ message: "Token has expired" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.execute(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
        [hashedPassword, user.id]
      );

      return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
    } catch (error) {
      console.error("Error in reset-password API endpoint: ", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
