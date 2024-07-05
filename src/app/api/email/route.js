import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req, res) {
  const body = await req.json();
  const { to, subject, text } = body;
  console.log(to, subject, text);

  const transporter = nodemailer.createTransport({
    host: "webmail.your-server.de",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "E-Mail erfolgreich gesendet" }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Fehler beim Senden der E-Mail", details: error },
      { status: 500 }
    );
  }
}
