import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { apiAuthMiddleware } from "@/apiMiddleware";

/*
    CREATE TABLE columns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        position INT NOT NULL
        droppableId VARCHAR(10) NOT NULL,
        creator VARCHAR(30) NOT NULL,
        created VARCHAR(20) NOT NULL;
    );
*/

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function GET(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    const [rows] = await connection.execute("SELECT * FROM columns ORDER BY position ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching columns:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const { title, creator, position } = await req.json();
  console.log("req data: ", title, position, creator);

  if (!title || !creator || position == null) {
    return NextResponse.json(
      { message: "Title, Position and creator are required" },
      { status: 400 }
    );
  }

  const droppableId = generateRandomString(10);
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

  try {
    const [result] = await connection.execute(
      "INSERT INTO columns (title, droppableId, position, creator, created) VALUES (?, ?, ?, ?, ?)",
      [title, droppableId, position, creator, formattedDate]
    );
    return NextResponse.json(
      { id: result.insertId, title, droppableId, position, creator, formattedDate },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding new column:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const { id, newTitle } = await req.json();
  if (!id || !newTitle) {
    return NextResponse.json({ message: "ID and new title are required" }, { status: 400 });
  }

  try {
    await connection.execute("UPDATE columns SET title = ? WHERE id = ?", [newTitle, id]);
    return NextResponse.json({ message: "Column updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating column:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
