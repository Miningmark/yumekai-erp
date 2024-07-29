import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

/*

   CREATE TABLE contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(255) NOT NULL,
      given_name VARCHAR(50) NOT NULL,
      surname VARCHAR(50) NOT NULL,
      nickname VARCHAR(50),
      artist_name VARCHAR(50),
      company VARCHAR(50),
      club VARCHAR(50),
      email VARCHAR(50),
      phone VARCHAR(20),
      website VARCHAR(255),
      instagram VARCHAR(255),
      postal_code INT UNSIGNED,
      city VARCHAR(50),
      street VARCHAR(50),
      house_number VARCHAR(50),
      country VARCHAR(50),
      contact_by VARCHAR(255),
      notes TEXT,
      previous_collaboration TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      birth_date DATE,
      discord_name VARCHAR(50),
      gender VARCHAR(10)
  );

*/

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    const [rows] = await connection.query("SELECT * FROM contacts ORDER BY surname ASC");

    const convertedRows = rows.map((row) => {
      // Konvertiere das Geburtsdatum
      if (row.birth_date) {
        const utcDate = new Date(row.birth_date);
        const berlinDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
        row.birth_date = berlinDate.toISOString().split("T")[0]; // Konvertiere in das gewünschte Format yyyy-MM-dd
      }
      // Convert category from JSON string to array
      if (typeof row.category === "string") {
        try {
          row.category = JSON.parse(row.category);
        } catch (e) {
          row.category = row.category.split(", ");
        }
      }
      return row;
    });

    return NextResponse.json(convertedRows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      given_name,
      surname,
      nickname,
      artist_name,
      company,
      club,
      email,
      phone,
      website,
      instagram,
      postal_code,
      city,
      street,
      house_number,
      contact_by,
      country,
      notes,
      previous_collaboration,
      category,
      birth_date,
      discord_name,
      gender,
    } = body;

    // Ensure all parameters are not undefined
    const params = [
      given_name ?? null,
      surname ?? null,
      nickname ?? null,
      artist_name ?? null,
      company ?? null,
      club ?? null,
      email ?? null,
      phone ?? null,
      website ?? null,
      instagram ?? null,
      postal_code ?? null,
      city ?? null,
      street ?? null,
      house_number ?? null,
      country ?? null,
      contact_by ?? null,
      notes ?? null,
      previous_collaboration ?? null,
      category ?? null,
      birth_date ?? null,
      discord_name ?? null,
      gender ?? null,
    ];

    if (!given_name || !surname || !category) {
      return NextResponse.json({ message: "Name and Category are required" }, { status: 400 });
    }

    const [insertResult] = await connection.execute(
      "INSERT INTO contacts (given_name, surname, nickname, artist_name, company, club, email, phone, website, instagram, postal_code, city, street, house_number, country, contact_by, notes, previous_collaboration, category, birth_date, discord_name, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );
    const [result] = await connection.query("SELECT LAST_INSERT_ID() as insertId");

    if (result && result.length > 0 && result[0].insertId) {
      const insertId = result[0].insertId;
      return NextResponse.json(
        { message: "Contact successfully added", insertId },
        { status: 201 }
      );
    } else {
      console.error("Failed to get insertId after contact creation");
      return NextResponse.json(
        { message: "Failed to get insertId after contact creation" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, created_at, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    if (keys.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const setString = keys.map((key) => `${key} = ?`).join(", ");
    const params = [...values, id];

    const [result] = await connection.execute(
      `UPDATE contacts SET ${setString} WHERE id = ?`,
      params
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Contact successfully updated" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Error updating contact" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
