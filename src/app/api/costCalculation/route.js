import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

/*
SQL Table

CREATE TABLE cost_calculation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creator VARCHAR(255) NOT NULL,
  event_date DATE,
  max_visitors INT,
  location VARCHAR(255)
);


*/

// Create a connection pool
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    const [rows] = await connection.execute("SELECT * FROM cost_calculation");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, creator } = body;

    if (!name || !creator) {
      return NextResponse.json(
        { message: "Alle Felder 'name' und 'creator' müssen ausgefüllt sein" },
        { status: 400 }
      );
    }

    const [result] = await connection.execute(
      "INSERT INTO cost_calculation (name, creator) VALUES (?, ?)",
      [name, creator]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: "Kostenberechnung erfolgreich erstellt" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Fehler beim Erstellen der Kostenberechnung" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, name, event_date, max_visitors, location } = body;

    if (typeof id !== "number" || (!name && !event_date && !max_visitors && !location)) {
      return NextResponse.json({ message: "Ungültige Daten" }, { status: 400 });
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (event_date) {
      updates.push("event_date = ?");
      values.push(event_date);
    }
    if (max_visitors) {
      updates.push("max_visitors = ?");
      values.push(max_visitors);
    }
    if (location) {
      updates.push("location = ?");
      values.push(location);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: "Keine Felder zum Aktualisieren" }, { status: 400 });
    }

    values.push(id);

    const [result] = await connection.execute(
      `UPDATE cost_calculation SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: "Kostenberechnung erfolgreich aktualisiert" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Fehler beim Aktualisieren der Kostenberechnung" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}
