import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/apiMiddleware";

/*
SQL Table

CREATE TABLE bugreport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
  reporter VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished BOOLEAN DEFAULT FALSE
);

*/

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

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
      return NextResponse.json({ message: "Fehler beim Senden des Bug reports" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    const [rows] = await connection.execute("SELECT * FROM bugreport WHERE finished = 0");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    const body = await req.json();
    const { id, finished } = body;

    if (typeof id !== "number" || typeof finished !== "boolean") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const [result] = await connection.execute("UPDATE bugreport SET finished = ? WHERE id = ?", [
      finished,
      id,
    ]);

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Bug report erfolgreich aktualisiert" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Fehler beim Aktualisieren des Bug reports" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
