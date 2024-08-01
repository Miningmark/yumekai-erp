import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { convertDateUTCtoCEST } from "@/utils/timeFunctions";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM convention_stands WHERE end_date >= CURDATE() ORDER BY start_date ASC LIMIT 5"
    );
    const convertedCons = rows.map((row) => {
      if (row.start_date) {
        row.start_date = convertDateUTCtoCEST(row.start_date);
      }
      if (row.end_date) {
        row.end_date = convertDateUTCtoCEST(row.end_date);
      }
      return row;
    });

    return NextResponse.json(convertedCons, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
