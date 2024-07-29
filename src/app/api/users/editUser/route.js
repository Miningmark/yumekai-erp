import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function getRoleIds(roleNames) {
  if (roleNames.length === 0) return []; // No roles to look up

  // Create a string of placeholders for the SQL query
  const placeholders = roleNames.map(() => "?").join(",");

  // Execute the query with the role names as parameters
  const [rows] = await connection.execute(
    `SELECT id, name FROM roles WHERE name IN (${placeholders})`,
    roleNames
  );

  // Create a mapping from role name to role ID
  const roleMap = new Map();
  rows.forEach((row) => roleMap.set(row.name, row.id));

  // Map role names to their corresponding IDs
  return roleNames.map((name) => roleMap.get(name));
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, name, email, roles, color } = await req.json();

  if (!name || !email || !roles || !color) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  try {
    const [existingUserByEmail] = await connection.execute(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existingUserByEmail.length > 0) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    const [existingUserByName] = await connection.execute(
      "SELECT * FROM users WHERE name = ? AND id != ?",
      [name, id]
    );

    if (existingUserByName.length > 0) {
      return NextResponse.json({ message: "Name already exists" }, { status: 400 });
    }

    await connection.execute("UPDATE users SET name = ?, email = ?, color = ? WHERE id = ?", [
      name,
      email,
      color,
      id,
    ]);

    const roleIds = await getRoleIds(roles);

    // Remove existing roles
    await connection.execute("DELETE FROM user_roles WHERE user_id = ?", [id]);

    // Insert new roles
    for (const roleId of roleIds) {
      await connection.execute("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
        id,
        roleId,
      ]);
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
