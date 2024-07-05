import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mysql from "mysql2/promise";

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
    const { from = "test@miningmark.de", to, subject, text } = body;
    console.log(from, to, subject, text);

    if (!from || !to || !subject || !text) {
      return NextResponse.json({ message: "Alle Felder müssen ausgefüllt sein" }, { status: 400 });
    }

    // Transporter erstellen
    const transporter = nodemailer.createTransport({
      host: "webmail.your-server.de", // SMTP-Host von Hetzner
      port: 587, // oder 465 für SSL
      secure: false, // true für 465, false für andere Ports
      auth: {
        user: from, //process.env.EMAIL_USER
        pass: process.env.EMAIL_PASS,
      },
    });

    // E-Mail Optionen definieren
    const mailOptions = {
      from,
      to,
      subject,
      text,
    };

    // E-Mail senden und speichern
    try {
      // E-Mail senden
      await transporter.sendMail(mailOptions);

      // E-Mail in der Datenbank speichern
      const [result] = await connection.execute(
        "INSERT INTO emails (email_from, email_to, email_subject, email_text, created_at) VALUES (?, ?, ?, ?, NOW())",
        [from, to, subject, text]
      );

      if (result.affectedRows > 0) {
        return NextResponse.json(
          { message: "E-Mail erfolgreich gesendet und gespeichert" },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "Fehler beim Speichern der E-Mail" }, { status: 500 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Fehler beim Senden der E-Mail", details: error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all emails from the database
    const [rows] = await connection.execute("SELECT * FROM emails ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
