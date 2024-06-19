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
    const [rows] = await connection.execute("SELECT * FROM users");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
