import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    const [rows] = await connection.query(
      "SELECT id, given_name, surname, stand_helper FROM contacts WHERE category LIKE '%Helfer%' ORDER BY surname ASC"
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
