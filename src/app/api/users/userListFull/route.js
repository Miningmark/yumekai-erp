import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET() {
  try {
    const [rows] = await connection.execute(
      "SELECT id, name, color, email, locked, failed_attempts FROM users"
    );

    for (const user of rows) {
      const [roles] = await connection.execute(
        "SELECT roles.name FROM roles JOIN user_roles ON roles.id = user_roles.role_id WHERE user_roles.user_id = ?",
        [user.id]
      );

      const userRoles = roles.map((role) => role.name);
      user.roles = userRoles;
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
