import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/cockieFunctions";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Aktuelles und neues Passwort sind erforderlich" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [session.user.id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Server Fehler. Bitte versuche es später erneut" },
        { status: 404 }
      );
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Aktuelles Password nicht korrekt" }, { status: 404 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute("UPDATE users SET password = ? WHERE name = ?", [
      hashedNewPassword,
      session.user.name,
    ]);

    return NextResponse.json({ message: "Passwort erfolgreich geändert" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server Fehler. Bitte versuche es später erneut" },
      { status: 500 }
    );
  }
}
