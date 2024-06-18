import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  const { name, password } = await req.json();

  if (!name || !password) {
    return NextResponse.json({ message: "Name and password are required" }, { status: 400 });
  }

  try {
    const [rows] = await connection.execute(
      "SELECT role, email, name FROM users WHERE name = ? AND password = ?",
      [name, password]
    );

    if (rows.length > 0) {
      const user = rows[0];
      return NextResponse.json(
        {
          message: "Login successful",
          role: user.role,
          email: user.email,
          name: user.name,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Invalid name or password" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
