import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import {
  convertDateFormat,
  convertDateUTCtoCEST,
  convertTimeStampFormat,
} from "@/utils/timeFunctions";

/*

CREATE TABLE convention_stands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  con_name VARCHAR(255) NOT NULL,
  helpers TEXT, -- This will store an array of helper IDs
  hotel VARCHAR(255),
  website VARCHAR(255)
  special_notes TEXT,
  workshops TEXT, -- This can be a JSON string or a comma-separated list
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    const [rows] = await connection.query(
      "SELECT * FROM convention_stands ORDER BY start_date ASC"
    );
    const convertedCons = rows.map((row) => {
      if (row.start_date) {
        row.start_date = convertDateUTCtoCEST(row.start_date);
      }
      if (row.end_date) {
        row.end_date = convertDateUTCtoCEST(row.end_date);
      }
      if (row.helpers) {
        row.helpers = JSON.parse(row.helpers);
      }
      return row;
    });

    return NextResponse.json(convertedCons, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { location, start_date, end_date, con_name, helpers, hotel, special_notes, workshops } =
      body;

    if (!location || !start_date || !end_date || !con_name) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    const params = [
      location,
      start_date,
      end_date,
      con_name,
      JSON.stringify(helpers),
      hotel ?? null,
      special_notes ?? null,
      workshops ?? null,
    ];

    const [insertResult] = await connection.execute(
      "INSERT INTO convention_stands (location, start_date, end_date, con_name, helpers, hotel, special_notes, workshops) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );

    return NextResponse.json(
      { message: "Convention Stand successfully added", id: insertResult.insertId },
      { status: 201 }
    );
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
      `UPDATE convention_stands SET ${setString} WHERE id = ?`,
      params
    );

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: "Convention Stand successfully updated" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Error updating convention stand" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
