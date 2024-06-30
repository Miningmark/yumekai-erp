import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

/*

   CREATE TABLE contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      name VARCHAR(50) NOT NULL,
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

export async function GET() {
  try {
    const [rows] = await connection.query("SELECT * FROM contacts ORDER BY name ASC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
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
      name ?? null,
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

    if (!name || !category) {
      return NextResponse.json({ message: "Name and Category are required" }, { status: 400 });
    }

    const [result] = await connection.execute(
      "INSERT INTO contacts (name, company, club, email, phone, website, instagram, postal_code, city, street, house_number, country, contact_by, notes, previous_collaboration, category, birth_date, discord_name, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Contact successfully added" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Error adding contact" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
