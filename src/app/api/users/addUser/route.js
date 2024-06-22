import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, role, password, color } = body;
    console.log("body: ", body);

    if (!name || !email || !role || !password || !color) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const lastlogins = [];
    lastlogins.unshift(` --;-- `);

    // Check if the username already exists
    const [nameRows] = await connection.execute("SELECT id FROM users WHERE name = ?", [name]);

    if (nameRows.length > 0) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    // Check if the email already exists
    const [emailRows] = await connection.execute("SELECT id FROM users WHERE email = ?", [email]);

    if (emailRows.length > 0) {
      return NextResponse.json({ message: "Email already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, role, password, color, lastlogins) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, role, hashedPassword, color, lastlogins]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "User added successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Failed to add user" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
