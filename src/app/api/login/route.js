import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { sendMail } from "@/utils/sendEmail";

import { setSession } from "@/lib/cockieFunctions";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const LOCK_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_FAILED_ATTEMPTS = 3;

export async function POST(req) {
  //console.log("API login endpoint hit");
  const { name, password } = await req.json();
  //console.log("Name and Password form login route", name, ", ", password);

  //const hashedPassword = await bcrypt.hash("Admin123!", 10);
  //console.log("hashedPassword: ", hashedPassword);

  if (!name || !password) {
    return NextResponse.json({ message: "Name and password are required" }, { status: 400 });
  }

  try {
    const [rows] = await connection.execute(
      "SELECT id, email, name, password, lastlogins, failed_attempts, last_failed_attempt, locked FROM users WHERE name = ?",
      [name]
    );

    if (rows.length === 0) {
      //console.log("---Falscher Name---");
      return NextResponse.json({ message: "Invalid name or password" }, { status: 401 });
    }

    const user = rows[0];

    // Check if the account is permanently locked
    if (user.locked) {
      return NextResponse.json(
        { message: "Account is permanently locked. Please contact support." },
        { status: 403 }
      );
    }

    const now = Date.now();

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      //console.log("---Falsches Password---");

      // Update failed attempts and last failed attempt timestamp
      const failedAttempts = (user.failed_attempts || 0) + 1;

      // Check if the account should be locked based on failed attempts
      if (
        failedAttempts >= MAX_FAILED_ATTEMPTS &&
        now - new Date(user.last_failed_attempt).getTime() < LOCK_TIME
      ) {
        // Permanently lock the account
        //console.log("wird gesperrt---------------------------------------------------");
        await connection.execute(
          "UPDATE users SET failed_attempts = 3, locked = 1, last_failed_attempt = ? WHERE id = ?",
          [new Date(), user.id]
        );
        const response = await sendMail({
          from: "system@miningmark.de",
          to: user.email,
          subject: "Account wurde Gesperrt",
          text: `Dein YumeKai-Planungsboard zugang wurde Gesperrt aufgrund zuviel fehlgeschlagener Login versuche.`,
        });

        if (response.status == 500) {
          console.error("Internal server error by send E-Mail: ", response);
          return NextResponse.json(
            { message: "Internal server error by send E-Mail" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { message: "Account is permanently locked. Please contact support." },
          { status: 403 }
        );
      }

      await connection.execute(
        "UPDATE users SET failed_attempts = ?, last_failed_attempt = ? WHERE id = ?",
        [failedAttempts, new Date(), user.id]
      );

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        return NextResponse.json(
          { message: "Account is locked. Please try again later." },
          { status: 403 }
        );
      }

      return NextResponse.json({ message: "Invalid name or password" }, { status: 401 });
    }

    // Reset failed attempts on successful login
    await connection.execute(
      "UPDATE users SET failed_attempts = 0, last_failed_attempt = NULL WHERE id = ?",
      [user.id]
    );

    //console.log("Rows lastlogins: ", user);

    const convertedUser = { ...user, lastlogins: JSON.parse(user.lastlogins) };
    const firstLogin = convertedUser.lastlogins.length === 0 ? true : false;
    //TODO: first login Passwort change
    //console.log("first Login: ", firstLogin);

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

    //console.log("lastlogins: ", convertedUser.lastlogins);
    convertedUser.lastlogins.unshift(` ${formattedDate};${userIp} `);

    // Trim the array to a maximum of 5 elements
    convertedUser.lastlogins = convertedUser.lastlogins.slice(0, 5);
    //console.log("LASTS LOGINS: ", convertedUser.lastlogins);

    // Update the database
    await connection.execute("UPDATE users SET lastlogins = ? WHERE id = ?", [
      JSON.stringify(convertedUser.lastlogins),
      user.id,
    ]);

    const [roles] = await connection.execute(
      "SELECT roles.name FROM roles JOIN user_roles ON roles.id = user_roles.role_id WHERE user_roles.user_id = ?",
      [user.id]
    );

    const userRoles = roles.map((role) => role.name);
    console.log(userRoles);

    const sessionUser = {
      email: user.email,
      name: user.name,
      id: user.id,
      roles: userRoles,
    };

    await setSession({ ...sessionUser, lastlogins: convertedUser.lastlogins });

    return NextResponse.json(
      {
        role: user.role,
        email: user.email,
        name: user.name,
        id: user.id,
        lastlogins: convertedUser.lastlogins,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API login endpoint: ", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
