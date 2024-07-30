export async function fetchColumns() {
  try {
    const response = await fetch("/api/posts/columns");
    if (!response.ok) {
      throw new Error("Failed to fetch postsColumns");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts_columns:", error);
  }
}

export async function fetchTasks() {
  try {
    const response = await fetch("/api/posts/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await response.json();
    const formattedTasks = data.map((task) => ({
      id: task.id,
      title: task.title,
      planned: task.planned,
      status: task.status,
      editor: task.editor,
      description: task.description,
      subtasks:
        task.subtasks.length == 0 ? [] : task.subtasks.split(",").map((subtask) => subtask.trim()), // Konvertiere die subtasks-Zeichenfolge in ein Array
      subtaskschecked:
        task.subtaskschecked.length == 0
          ? []
          : task.subtaskschecked.split(",").map((checked) => checked.trim() === "true"), // Konvertiere die subtaskschecked-Zeichenfolge in ein Array von booleschen Werten
      creator: task.creator,
      created: task.created,
      position: task.position,
    }));
    return formattedTasks;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
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
