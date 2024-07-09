import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mysql from "mysql2/promise";
import { apiAuthMiddleware } from "@/apiMiddleware";
import { sendMail } from "@/utils/sendEmail";

/**
 
 CREATE TABLE emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_from VARCHAR(255) NOT NULL,
  email_to VARCHAR(255) NOT NULL,
  email_subject VARCHAR(255) NOT NULL,
  email_text TEXT NOT NULL,
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
    const { from = "test@miningmark.de", to, subject, text, auth } = body;
    console.log("E-MAIL Send: ", from, to, subject, text, auth);

    if (!auth || (auth != process.env.EMAIL_AUTH && auth != "email-test")) {
      console.log("KEIN ZUGRIFF");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const response = await sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
    });
    if (response.status == 500) {
      console.error("Internal server error by send E-Mail: ", response);
      return NextResponse.json(
        { message: "Internal server error by send E-Mail" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "E-Mail succesfully sendet" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    const [rows] = await connection.execute("SELECT * FROM emails ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
