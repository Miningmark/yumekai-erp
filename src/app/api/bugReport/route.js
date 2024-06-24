import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

/*
SQL Table

CREATE TABLE bugreport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
  reporter VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, reporter } = body;

    if (!title || !description || !reporter) {
      return NextResponse.json({ message: "Alle felder müssen ausgefüllt sein" }, { status: 400 });
    }

    // Insert bug report into the database
    const [result] = await connection.execute(
      "INSERT INTO bugreport (title, description, reporter) VALUES (?, ?, ?)",
      [title, description, reporter]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Bug report erfolgreich gesendet" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Fehler beim Senden des bug reports" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all bug reports from the database
    const [rows] = await connection.execute("SELECT * FROM bugreport");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
