export async function fetchColumns() {
  try {
    const response = await fetch("/api/columns");
    if (!response.ok) {
      throw new Error("Failed to fetch columns");
    }
    const data = await response.json();
    console.log("Columns data", data);
    console.log("columns.length", data.length);
    return data;
  } catch (error) {
    console.error("Failed to fetch columns:", error);
  }
}

export async function fetchTasks() {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    const formattedTasks = data.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      editor: task.editor,
      description: task.description,
      subtasks: task.subtasks.split(",").map((subtask) => subtask.trim()), // Konvertiere die subtasks-Zeichenfolge in ein Array
      subtaskschecked: task.subtaskschecked.split(",").map((checked) => checked.trim() === "true"), // Konvertiere die subtaskschecked-Zeichenfolge in ein Array von booleschen Werten
      creator: task.creator,
      created: task.created,
      position: task.position,
    }));
    return formattedTasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
}

export async function fetchUsers() {
  try {
    const response = await fetch("/api/users/userList");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}
