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
    const [rows] = await connection.query(
      "SELECT * FROM convention_stands WHERE end_date >= CURDATE() ORDER BY start_date ASC LIMIT 5"
    );
    const convertedCons = rows.map((row) => {
      if (row.start_date) {
        const utcDate = new Date(row.start_date);
        const berlinDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
        row.start_date = berlinDate.toISOString().split("T")[0];
      }
      return row;
    });

    return NextResponse.json(convertedCons, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
