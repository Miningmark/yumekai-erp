import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/apiMiddleware";

/**
  CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    editor VARCHAR(50) NOT NULL,
    description TEXT,
    subtasks TEXT,
    subtaskschecked TEXT,
    creator VARCHAR(50),
    created VARCHAR(50),
    position INT 
  );

  CREATE TABLE tasksdeleted (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    editor VARCHAR(50) NOT NULL,
    description TEXT,
    subtasks TEXT,
    subtaskschecked TEXT,
    creator VARCHAR(50),
    created VARCHAR(50),
    deleted_by VARCHAR(50);
    deleted_at DATETIME;
  );
 */

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    const [rows] = await connection.query("SELECT * FROM tasks ORDER BY position ASC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  const { task } = await req.json();
  if (!task) {
    return NextResponse.json({ message: "Task data is required" }, { status: 400 });
  }

  try {
    await connection.query("INSERT INTO tasks SET ?", task);
    const [result] = await connection.query("SELECT LAST_INSERT_ID() as insertId");

    if (result && result.length > 0 && result[0].insertId) {
      const insertId = result[0].insertId;
      return NextResponse.json({ message: "Task created successfully", insertId }, { status: 201 });
    } else {
      console.error("Failed to get insertId after task creation");
      return NextResponse.json(
        { message: "Failed to get insertId after task creation" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  const { id, task } = await req.json();

  if (!id || !task) {
    return NextResponse.json(
      { message: "Task ID and updated task data are required" },
      { status: 400 }
    );
  }

  try {
    await connection.query("UPDATE tasks SET ? WHERE id = ?", [task, id]);
    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  const { id, deletedBy } = await req.json();

  if (!id || !deletedBy) {
    return NextResponse.json({ message: "Task ID and deletedBy are required" }, { status: 400 });
  }

  try {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // Get the task to be deleted
      const [taskRows] = await conn.query("SELECT * FROM tasks WHERE id = ?", [id]);
      if (taskRows.length === 0) {
        throw new Error("Task not found");
      }
      const task = taskRows[0];

      // Insert the task into tasksdeleted with deleted_by and deleted_at
      await conn.query(
        "INSERT INTO tasksdeleted (id, title, status, editor, description, subtasks, subtaskschecked, creator, created, deleted_by, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          task.id,
          task.title,
          task.status,
          task.editor,
          task.description,
          task.subtasks,
          task.subtaskschecked,
          task.creator,
          task.created,
          deletedBy,
          new Date(), // current timestamp
        ]
      );

      // Delete the task from tasks
      await conn.query("DELETE FROM tasks WHERE id = ?", [id]);

      await conn.commit();
      conn.release();

      return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
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
  const middlewareResponse = await apiAuthMiddleware(req);
  if (middlewareResponse) return middlewareResponse;

  const { tasks } = await req.json();

  if (!Array.isArray(tasks)) {
    return NextResponse.json({ message: "Tasks array is required" }, { status: 400 });
  }

  try {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      for (const task of tasks) {
        if (!task.id) {
          throw new Error("Each task must have an ID");
        }

        await conn.query(
          `INSERT INTO tasks (id, title, status, editor, description, subtasks, subtaskschecked, creator, created, position) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), 
             status = VALUES(status), 
             editor = VALUES(editor), 
             description = VALUES(description), 
             subtasks = VALUES(subtasks), 
             subtaskschecked = VALUES(subtaskschecked), 
             creator = VALUES(creator), 
             created = VALUES(created), 
             position = VALUES(position)`,
          [
            task.id,
            task.title,
            task.status,
            task.editor,
            task.description,
            task.subtasks,
            task.subtaskschecked,
            task.creator,
            task.created,
            task.position,
          ]
        );
      }

      await conn.commit();
      conn.release();

      return NextResponse.json({ message: "Tasks updated successfully" }, { status: 200 });
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
/*
  } else if (req.method === "PUT") {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: "Tasks array is required" });
    }

    try {
      const conn = await connection.getConnection();

      try {
        await conn.beginTransaction();

        for (const task of tasks) {
          if (!task.id) {
            throw new Error("Each task must have an ID");
          }

          await conn.query(
            `INSERT INTO tasks (id, title, status, editor, description, subtasks, subtaskschecked, creator, created, position) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), 
             status = VALUES(status), 
             editor = VALUES(editor), 
             description = VALUES(description), 
             subtasks = VALUES(subtasks), 
             subtaskschecked = VALUES(subtaskschecked), 
             creator = VALUES(creator), 
             created = VALUES(created), 
             position = VALUES(position)`,
            [
              task.id,
              task.title,
              task.status,
              task.editor,
              task.description,
              task.subtasks,
              task.subtaskschecked,
              task.creator,
              task.created,
              task.position,
            ]
          );
        }

        await conn.commit();
        conn.release();

        return res.status(200).json({ message: "Tasks updated successfully" });
      } catch (error) {
        await conn.rollback();
        conn.release();
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
  */
