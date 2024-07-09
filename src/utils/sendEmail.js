"use server";

import nodemailer from "nodemailer";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function sendMail(mail) {
  const { from = "test@miningmark.de", to, subject, text } = mail;
  console.log("E-MAIL Send: ", from, to, subject, text);

  if (!from || !to || !subject || !text) {
    return { message: "Alle Felder müssen ausgefüllt sein", status: 400 };
  }
  let emailPassword = "";
  switch (from) {
    case "test@miningmark.de":
      emailPassword = process.env.EMAIL_PASS_TEST;
      break;
    case "system@miningmark.de":
      emailPassword = process.env.EMAIL_PASS_SYSTEM;
      break;
    case "rechnung@miningmark.de":
      emailPassword = process.env.EMAIL_PASS_RECHNUNG;
      break;

    default:
      break;
  }

  const transporter = nodemailer.createTransport({
    host: "webmail.your-server.de", // SMTP-Host von Hetzner
    port: 587, // oder 465 für SSL
    secure: false, // true für 465, false für andere Ports
    auth: {
      user: from,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("EMAIL in Db speichern");

    const [result] = await connection.execute(
      "INSERT INTO emails (email_from, email_to, email_subject, email_text, created_at) VALUES (?, ?, ?, ?, NOW())",
      [from, to, subject, text]
    );
    console.log("E-MAIL Result", result);

    if (result.affectedRows > 0) {
      return { message: "E-Mail erfolgreich gesendet und gespeichert", status: 200 };
    } else {
      return { message: "Fehler beim Speichern der E-Mail", status: 500 };
    }
  } catch (error) {
    console.error(error);
    return { message: "Fehler beim Senden der E-Mail", status: 500 };
  }
}
