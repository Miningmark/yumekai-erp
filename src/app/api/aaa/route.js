import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import {
  convertDateFormat,
  convertDateUTCtoCEST,
  convertTimeStampFormat,
} from "@/utils/timeFunctions";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    const [rows] = await connection.query("SELECT * FROM date_test ORDER BY id DESC LIMIT 1");

    if (rows.length > 0) {
      const row = rows[0];
      const utcDateValue = row.test_date;

      if (utcDateValue) {
        // Konvertieren von UTC in lokale Zeit
        //const utcDate = new Date(utcDateValue + "Z"); // Fügen Sie 'Z' für UTC hinzu
        //const localDate = utcDate.toLocaleString(); // Konvertieren in lokale Zeit
        //row.test_date = localDate; // Oder formatieren Sie nach Bedarf

        const utcDate = new Date(utcDateValue + "Z");
        const options = {
          timeZone: "Europe/Berlin",
          year: "numeric",
          month: "2-digit", //  "2-digit" für führende Nullen
          day: "2-digit", //  "numeric" für keine führenden Nullen
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        //row.formattedDate = new Intl.DateTimeFormat("de-DE", options).format(utcDateValue);
        row.Time = convertTimeStampFormat(utcDateValue);
        row.Time2 = convertDateUTCtoCEST(utcDateValue);
        row.Time3 = convertDateFormat(row.Time2);
      }

      return NextResponse.json(row, { status: 200 });
    } else {
      return NextResponse.json({ message: "No records found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Erzeuge den aktuellen Zeitstempel
    const currentTimestamp = new Date();

    await connection.query("INSERT INTO date_test (test_date) VALUES (?)", [currentTimestamp]);
    return NextResponse.json({ message: "Date saved successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
