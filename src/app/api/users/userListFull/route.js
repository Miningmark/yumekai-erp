import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/apiMiddleware";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    const [rows] = await connection.execute(
      "SELECT name, color, email, role, locked, failed_attempts FROM users"
    );
    console.log("userList: ", rows);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
