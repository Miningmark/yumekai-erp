import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/apiMiddleware";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function DELETE(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;
  const { name } = await req.json();

  try {
    const [result] = await connection.execute("DELETE FROM users WHERE name = ?", [name]);

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;
  const { id, name, email, role, color } = await req.json();

  if (!name || !email || !role || !color) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  try {
    const [existingUserByEmail] = await connection.execute(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existingUserByEmail.length > 0) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    const [existingUserByName] = await connection.execute(
      "SELECT * FROM users WHERE name = ? AND id != ?",
      [name, id]
    );

    if (existingUserByName.length > 0) {
      return NextResponse.json({ message: "Name already exists" }, { status: 400 });
    }

    await connection.execute(
      "UPDATE users SET name = ?, email = ?, role = ?, color = ? WHERE id = ?",
      [name, email, role, color, id]
    );

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
