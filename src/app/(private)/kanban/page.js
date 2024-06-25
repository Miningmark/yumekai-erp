"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Column from "@/components/kanbanComponents/Column";
import AddNewTask from "@/components/kanbanComponents/AddNewTask";
import TaskCardDetail from "@/components/kanbanComponents/TaskCardDetail";
import TaskCardEdit from "@/components/kanbanComponents/TaskCardEdit";
import io from "socket.io-client";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import RenameColumnModal from "@/components/kanbanComponents/RenameColumnModal";

import { getSession, login, logout } from "@/lib/cockietest";

const columnsAlt = [
  { id: "todo", title: "TODO" },
  { id: "inProgress", title: "In Progress" },
  { id: "completed", title: "Completed" },
  { id: "completed2", title: "e Wer e Wer e Wer e " },
];

const taskList = [
  {
    id: 1,
    title: "markus",
    status: "todo",
    editor: "Markus",
    description: "Hallo ich bin eine Beschreibung",
    subtasks: ["afianfg", "AGaggage", "aewgGg"],
    subtaskschecked: [true, false, false],
    creator: "Markus",
    created: "05.06.2024 21:48:40",
  },
];

const KanbanBoard = styled.div`
  margin: 20px;
  display: flex;
  gap: 20px;
  max-width: 100%;
  overflow-x: auto;
`;

const AddButton = styled(GreenButton)`
  position: absolute;
  top: 85px;
  left: 20px;
`;

const NewColumnButton = styled(StyledButton)`
  min-width: 200px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Kanban() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [taskDetailId, setTaskDetailId] = useState(null);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [renameColumnModalOpen, setRenameColumnModalOpen] = useState(false);
  const [columnToRename, setColumnToRename] = useState(null);

  const socket = io(process.env.NEXTAUTH_URL);

  useEffect(() => {
    async function checkSession() {
      setSession(await getSession());
    }

    checkSession();
  }, []);

  useEffect(() => {
    async function fetchColumns() {
      try {
        const response = await fetch("/api/columns");
        if (!response.ok) {
          throw new Error("Failed to fetch columns");
        }
        const data = await response.json();
        console.log("Columns data", data);
        console.log("columns.length", data.length);
        setColumns(data);
      } catch (error) {
        console.error("Failed to fetch columns:", error);
      }
    }

    fetchColumns();
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXTAUTH_URL);
    socket.on("connect", () => {
      //console.log("Socket connected:", socket.id);
    });

    socket.on("loadNewColumns", (data) => {
      //console.log("Received loadNewTasks event:", data);
      fetchColumns();
    });

    async function fetchColumns() {
      try {
        const response = await fetch("/api/columns");
        if (!response.ok) {
          throw new Error("Failed to fetch columns");
        }
        const data = await response.json();
        console.log("Columns data", data);
        console.log("columns.length", data.length);
        setColumns(data);
      } catch (error) {
        console.error("Failed to fetch columns:", error);
      }
    }

    return () => {
      socket.disconnect();
    };
  });

  useEffect(() => {
    const socket = io(process.env.NEXTAUTH_URL);
    socket.on("connect", () => {
      //console.log("Socket connected:", socket.id);
    });

    socket.on("loadNewTasks", (data) => {
      //console.log("Received loadNewTasks event:", data);
      fetchTasks();
    });

    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        // Stellen Sie sicher, dass die Daten im erwarteten Format vorliegen
        // und passen Sie sie gegebenenfalls an Ihren Zustand an
        const formattedTasks = data.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          editor: task.editor,
          description: task.description,
          subtasks: task.subtasks.split(",").map((subtask) => subtask.trim()), // Konvertiere die subtasks-Zeichenfolge in ein Array
          subtaskschecked: task.subtaskschecked
            .split(",")
            .map((checked) => checked.trim() === "true"), // Konvertiere die subtaskschecked-Zeichenfolge in ein Array von booleschen Werten
          creator: task.creator,
          created: task.created,
          position: task.position,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    return () => {
      socket.disconnect();
    };
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users/userList");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        // Stellen Sie sicher, dass die Daten im erwarteten Format vorliegen
        // und passen Sie sie gegebenenfalls an Ihren Zustand an
        const formattedTasks = data.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          editor: task.editor,
          description: task.description,
          subtasks: task.subtasks.split(",").map((subtask) => subtask.trim()), // Konvertiere die subtasks-Zeichenfolge in ein Array
          subtaskschecked: task.subtaskschecked
            .split(",")
            .map((checked) => checked.trim() === "true"), // Konvertiere die subtaskschecked-Zeichenfolge in ein Array von booleschen Werten
          creator: task.creator,
          created: task.created,
          position: task.position,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  function openTaskDetail(taskId) {
    setTaskDetailId(taskId);
    setTaskDetailModalOpen(true);
  }

  function closeTaskDetail() {
    setTaskDetailModalOpen(false);
  }

  function closeTaskEdit() {
    setTaskEditMode(false);
  }
  function openTaskEdit() {
    setTaskEditMode(true);
  }

  async function deleteTask(taskId) {
    try {
      // Make the DELETE request to delete the task
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (response.ok) {
        setTaskDetailModalOpen(false);
        setTaskDetailId(null);
        const newTaskslist = tasks.filter((task) => task.id != taskId);
        setTasks([...newTaskslist]);
        socket.emit("newTask", "Hello Server");
      } else {
        console.error("Failed to delete task:", response.status);
        // Handle error
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Handle error
    }
  }

  function formatDateForMySQL(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async function editTask(changeTask) {
    try {
      // Prepare the updated task data
      const subtasksString = changeTask.subtasks.join(", ");
      const subtasksCheckedString = changeTask.subtaskschecked.join(", ");

      const taskToUpdate = {
        ...changeTask,
        subtasks: subtasksString,
        subtaskschecked: subtasksCheckedString,
        created: formatDateForMySQL(changeTask.created), // Format the created date
      };

      // Make the PUT request to update the task
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: changeTask.id, task: taskToUpdate }),
      });

      if (response.ok) {
        const newTaskslist = tasks.map((task) => (task.id === changeTask.id ? changeTask : task));
        setTasks([...newTaskslist]);
        socket.emit("newTask", "Hello Server");
        closeTaskEdit();
      } else {
        console.error("Failed to update task:", response.status);
        // Handle error
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      // Handle error
    }
  }

  async function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const draggedTaskId = parseInt(draggableId, 10);
    const draggedTask = tasks.find((task) => task.id === draggedTaskId);

    let updatedStatus = draggedTask.status;

    if (source.droppableId !== destination.droppableId) {
      const destinationColumn = columns.find(
        (column) => column.droppableId === destination.droppableId
      );
      updatedStatus = destinationColumn ? destinationColumn.droppableId : draggedTask.status;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggedTaskId) {
        return {
          ...task,
          status: updatedStatus,
        };
      }
      return task;
    });

    // Find the task to move
    const moveTask = updatedTasks.find((task) => task.id === draggedTaskId);

    // Get all tasks with the destination status except the moved task
    const destinationTasksWithOut = updatedTasks.filter(
      (task) => task.status === destination.droppableId && task.id !== moveTask.id
    );

    // Remove these tasks from the updatedTasks
    const filteredUpdatedTasks = updatedTasks.filter(
      (task) => task.status !== destination.droppableId
    );

    // Add the task to the destination array at the new index
    destinationTasksWithOut.splice(destination.index, 0, moveTask);

    // Reconstruct the final tasks array
    const finalTasks = [...filteredUpdatedTasks, ...destinationTasksWithOut];

    let finalTasksSorted = finalTasks.map((task, index) => {
      return { ...task, position: index };
    });

    setTasks([...finalTasksSorted]);

    //-----------------------------------------------------------

    const finalTasksSortedSQL = finalTasksSorted.map((task) => {
      return {
        ...task,
        subtasks: task.subtasks.join(", "),
        subtaskschecked: task.subtaskschecked.join(", "),
      };
    });

    //-----------------------------------------------------------

    // Update the task status in the database
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: finalTasksSortedSQL }),
      });
      socket.emit("newTask", "Hello Server");
      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }
    } catch (error) {
      console.error("Failed to update tasks:", error);
      setTasks(tasks);
    }
  }

  function closeAddNewTask() {
    setNewTaskModalOpen(false);
  }

  async function addNewTask(newTask) {
    try {
      // Konvertiere die Arrays subtasks und subtaskschecked in Zeichenfolgen
      const subtasksString = newTask.subtasks.join(", ");
      const subtasksCheckedString = newTask.subtaskschecked.join(", ");

      // Erstelle ein neues Aufgabenobjekt mit den konvertierten Zeichenfolgen
      const taskToAdd = {
        ...newTask,
        subtasks: subtasksString,
        subtaskschecked: subtasksCheckedString,
        position: tasks.length,
      };

      // Sende die POST-Anfrage an die API mit dem neuen Aufgabenobjekt
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskToAdd }),
      });

      if (response.ok) {
        // Wenn die Aufgabe erfolgreich hinzugefügt wurde, aktualisiere den Zustand
        const responseData = await response.json();
        // Überprüfe, ob die Antwort die ID des neu erstellten Tasks enthält
        if (responseData && responseData.insertId) {
          setTasks([...tasks, { ...newTask, id: responseData.insertId }]);
          socket.emit("newTask", "Hello Server");
          closeAddNewTask();
        } else {
          console.error("Failed to add task: Response does not contain insertId");
          // Handle error
        }
      } else {
        console.error("Failed to add task:", response.status);
        // Handle error
      }
    } catch (error) {
      console.error("Failed to add task:", error);
      // Handle error
    }
  }

  function closeTaskDetail() {
    setTaskDetailModalOpen(false);
  }

  async function addNewColumn() {
    const title = prompt("Enter column title:");
    if (!title) return;

    try {
      console.log("Add new Column", {
        title,
        position: columns.length,
        creator: session.user.name,
      });
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, position: columns.length, creator: session.user.name }),
      });

      if (response.ok) {
        const newColumn = await response.json();
        setColumns([...columns, newColumn]);
        socket.emit("newColumn", "Hello Server");
      } else {
        console.error("Failed to add column:", response.status);
      }
    } catch (error) {
      console.error("Failed to add column:", error);
    }
  }

  async function renameColumn(columnId, newTitle) {
    try {
      const response = await fetch("/api/columns", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: columnId, newTitle }),
      });

      if (response.ok) {
        setColumns((prevColumns) =>
          prevColumns.map((column) =>
            column.id === columnId
              ? {
                  ...column,
                  title: newTitle,
                }
              : column
          )
        );
        socket.emit("newColumn", "Hello Server");
      } else {
        console.error("Failed to rename column:", response.status);
      }
    } catch (error) {
      console.error("Failed to rename column:", error);
    }
  }

  function openRenameColumnModal(column) {
    setColumnToRename(column);
    setRenameColumnModalOpen(true);
  }

  function closeRenameColumnModal() {
    setRenameColumnModalOpen(false);
    setColumnToRename(null);
  }

  return (
    <>
      <h1>ToDo</h1>
      <AddButton onClick={() => setNewTaskModalOpen(true)}>Neuer Eintrag</AddButton>

      <DragDropContext onDragEnd={handleDragEnd}>
        <KanbanBoard>
          {columns.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.droppableId)}
              droppableId={column.droppableId}
              onTitleClick={() => openRenameColumnModal(column)}
              openTaskDetail={openTaskDetail}
              users={users}
            />
          ))}
          <NewColumnButton onClick={addNewColumn}>Neue Spalte</NewColumnButton>
        </KanbanBoard>
      </DragDropContext>

      {newTaskModalOpen && (
        <AddNewTask
          addNewTask={addNewTask}
          handleCloseAddNewTask={closeAddNewTask}
          columns={columns}
          editors={users.map((user) => user.name)}
          session={session}
        />
      )}
      {taskDetailModalOpen && (
        <TaskCardDetail
          task={tasks.find((task) => task.id == taskDetailId)}
          handleCloseTaskDetail={closeTaskDetail}
          handleDeleteTask={deleteTask}
          handleOpenTaskEdit={openTaskEdit}
          handleEditTask={editTask}
        />
      )}
      {taskEditMode && (
        <TaskCardEdit
          task={tasks.find((task) => task.id == taskDetailId)}
          editors={users.map((user) => user.name)}
          handleCloseTaskEdit={closeTaskEdit}
          handleEditTask={editTask}
        />
      )}
      {renameColumnModalOpen && (
        <RenameColumnModal
          column={columnToRename}
          onClose={closeRenameColumnModal}
          onRename={renameColumn}
        />
      )}
    </>
  );
}
