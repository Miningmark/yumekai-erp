import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

/*
    CREATE TABLE posts_columns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        position INT NOT NULL,
        droppableId VARCHAR(10) NOT NULL,
        creator VARCHAR(30) NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  try {
    const [rows] = await connection.execute("SELECT * FROM posts_columns ORDER BY position ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching posts_columns:", error);
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

  try {
    const [result] = await connection.execute(
      "INSERT INTO posts_columns (title, droppableId, position, creator) VALUES (?, ?, ?, ?)",
      [title, droppableId, position, creator]
    );
    return NextResponse.json(
      { id: result.insertId, title, droppableId, position, creator },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding new posts_columns:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const { id, newTitle } = await req.json();
  if (!id || !newTitle) {
    return NextResponse.json({ message: "ID and new title are required" }, { status: 400 });
  }

  try {
    await connection.execute("UPDATE posts_columns SET title = ? WHERE id = ?", [newTitle, id]);
    return NextResponse.json({ message: "posts_columns updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating posts_columns:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
