import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { convertDateUTCtoCEST, convertTimeStampFormat } from "@/utils/timeFunctions";

/**
  CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    planned DATE,
    status VARCHAR(50) NOT NULL,
    editor VARCHAR(50) NOT NULL,
    description TEXT,
    subtasks TEXT,
    subtaskschecked TEXT,
    creator VARCHAR(50),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    position INT 
  );

  CREATE TABLE postsdeleted (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    planned DATE,
    status VARCHAR(50) NOT NULL,
    editor VARCHAR(50) NOT NULL,
    description TEXT,
    subtasks TEXT,
    subtaskschecked TEXT,
    creator VARCHAR(50),
    created DATETIME,
    deleted_by VARCHAR(50),
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
 */

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    const [rows] = await connection.query("SELECT * FROM posts ORDER BY position ASC");

    const convertedRows = rows.map((row) => {
      if (row.planned) {
        row.planned = convertDateUTCtoCEST(row.planned);
      }
      if (row.created) {
        row.created = convertTimeStampFormat(row.created);
      }
      return row;
    });

    return NextResponse.json(convertedRows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const { task } = await req.json();
  if (!task) {
    return NextResponse.json({ message: "Post data is required" }, { status: 400 });
  }

  try {
    await connection.query("INSERT INTO posts SET ?", task);
    const [result] = await connection.query("SELECT LAST_INSERT_ID() as insertId");

    if (result && result.length > 0 && result[0].insertId) {
      const insertId = result[0].insertId;
      return NextResponse.json({ message: "Post created successfully", insertId }, { status: 201 });
    } else {
      console.error("Failed to get insertId after post creation");
      return NextResponse.json(
        { message: "Failed to get insertId after post creation" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const { id, task } = await req.json();

  if (!id || !task) {
    return NextResponse.json(
      { message: "Post ID and updated post data are required" },
      { status: 400 }
    );
  }
  const { created, ...taskUpdate } = task;

  try {
    await connection.query("UPDATE posts SET ? WHERE id = ?", [taskUpdate, id]);
    return NextResponse.json({ message: "Post updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id, deletedBy } = await req.json();

  if (!id || !deletedBy) {
    return NextResponse.json({ message: "Post ID and deletedBy are required" }, { status: 400 });
  }

  try {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // Get the task to be deleted
      const [taskRows] = await conn.query("SELECT * FROM posts WHERE id = ?", [id]);
      if (taskRows.length === 0) {
        throw new Error("Post not found");
      }
      const task = taskRows[0];

      // Insert the task into tasksdeleted with deleted_by and deleted_at
      await conn.query(
        "INSERT INTO postsdeleted (id, title, planned, status, editor, description, subtasks, subtaskschecked, creator, created, deleted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          task.id,
          task.title,
          task.planned,
          task.status,
          task.editor,
          task.description,
          task.subtasks,
          task.subtaskschecked,
          task.creator,
          task.created,
          deletedBy,
        ]
      );

      // Delete the task from posts
      await conn.query("DELETE FROM posts WHERE id = ?", [id]);

      await conn.commit();
      conn.release();

      return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
      await conn.rollback();
      conn.release();
      console.error(error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  const { tasks } = await req.json();

  if (!Array.isArray(tasks)) {
    return NextResponse.json({ message: "Posts array is required" }, { status: 400 });
  }

  try {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      for (const task of tasks) {
        if (!task.id) {
          throw new Error("Each post must have an ID");
        }

        await conn.query(
          `INSERT INTO posts (id, title, planned, status, editor, description, subtasks, subtaskschecked, creator, position) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), 
             planned = VALUES(planned),
             status = VALUES(status), 
             editor = VALUES(editor), 
             description = VALUES(description), 
             subtasks = VALUES(subtasks), 
             subtaskschecked = VALUES(subtaskschecked), 
             creator = VALUES(creator),
             position = VALUES(position)`,
          [
            task.id,
            task.title,
            task.planned,
            task.status,
            task.editor,
            task.description,
            task.subtasks,
            task.subtaskschecked,
            task.creator,
            task.position,
          ]
        );
      }

      await conn.commit();
      conn.release();

      return NextResponse.json({ message: "Posts updated successfully" }, { status: 200 });
    } catch (error) {
      await conn.rollback();
      conn.release();
      console.error(error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
