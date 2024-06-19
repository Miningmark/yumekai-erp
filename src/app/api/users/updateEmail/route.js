import mysql from "mysql2/promise";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const [existingUser] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    await connection.execute("UPDATE users SET email = ? WHERE name = ?", [
      email,
      session.user.name,
    ]);

    return NextResponse.json({ message: "Email updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
