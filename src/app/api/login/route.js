import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

import { getSession, login, logout, setSession } from "@/lib/cockieFunctions";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function POST(req) {
  console.log("API login endpoint hit");
  const { name, password } = await req.json();
  console.log("Name and Password form login route", name, ", ", password);

  //const hashedPassword = await bcrypt.hash("Admin123!", 10);
  //console.log("hashedPassword: ", hashedPassword);

  if (!name || !password) {
    return NextResponse.json({ message: "Name and password are required" }, { status: 400 });
  }

  try {
    const [rows] = await connection.execute(
      "SELECT id, role, email, name, password, lastlogins FROM users WHERE name = ?",
      [name]
    );

    if (rows.length === 0) {
      console.log("---Falscher Name---");
      return NextResponse.json({ message: "Invalid name or password" }, { status: 401 });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("---Falsches Password---");
      return NextResponse.json({ message: "Invalid name or password" }, { status: 401 });
    }

    // Get the current timestamp, IP, and location
    const formattedDate = new Date()
      .toLocaleString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "");
    const userIp = req.headers.get("x-forwarded-for") || req.headers.get("remote-addr");
    console.log("IP x-forwarded-for: ", req.headers.get("x-forwarded-for"));
    console.log("IP remote-addr: ", req.headers.get("remote-addr"));
    //console.log("IP connection.remoteAddress: ", req.connection.remoteAddress);

    console.log(
      "user from login API -------------------------------------------------------",
      user
    );
    // Update the lastlogin array
    let lastlogins = user.lastlogins ? JSON.parse(user.lastlogins) : [];
    lastlogins.unshift(` ${formattedDate};${userIp} `);

    // Trim the array to a maximum of 5 elements
    lastlogins = lastlogins.slice(0, 5);
    //console.log("LASTS LOGINS: ", lastlogins);

    // Update the database
    await connection.execute("UPDATE users SET lastlogins = ? WHERE id = ?", [
      JSON.stringify(lastlogins),
      user.id,
    ]);

    await setSession({ ...user, lastlogins: lastlogins });

    return NextResponse.json(
      {
        role: user.role,
        email: user.email,
        name: user.name,
        id: user.id,
        lastlogins: lastlogins,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API login endpoint: ", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
