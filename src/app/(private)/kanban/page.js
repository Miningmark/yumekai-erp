"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Column from "@/components/kanbanComponents/Column";
import AddNewTask from "@/components/kanbanComponents/AddNewTask";
import TaskCardDetail from "@/components/kanbanComponents/TaskCardDetail";
import TaskCardEdit from "@/components/kanbanComponents/TaskCardEdit";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import RenameColumnModal from "@/components/kanbanComponents/RenameColumnModal";
import { fetchColumns, fetchTasks, fetchUsers } from "@/utils/kanban/loadContent";
import { getSession, login, logout } from "@/lib/cockietest";
import { socket } from "@/app/socket";
import NewColumn from "@/components/kanbanComponents/NewColumn";

const columnsAlt = [
  { id: "todo", title: "TODO" },
  { id: "inProgress", title: "In Progress" },
  { id: "completed", title: "Completed" },
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
  const [tasks, setTasks] = useState(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [taskDetailId, setTaskDetailId] = useState(null);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [users, setUsers] = useState(null);
  const [columns, setColumns] = useState(null);
  const [renameColumnModalOpen, setRenameColumnModalOpen] = useState(false);
  const [columnToRename, setColumnToRename] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [newColumnModal, setNewColumnModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [usersData, columnsData, tasksData] = await Promise.all([
        fetchUsers(),
        fetchColumns(),
        fetchTasks(),
      ]);
      setUsers(usersData);
      setColumns(columnsData);
      setTasks(tasksData);
    }

    fetchData();
    checkSession();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("loadNewTasks", fetchTasksAndUpdateState);
    socket.on("loadNewColumns", fetchColumnsAndUpdateState);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("loadNewTasks", fetchTasksAndUpdateState);
      socket.off("loadNewColumns", fetchColumnsAndUpdateState);
    };
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
  }, [socket.connected]);

  function onConnect() {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }

  function onDisconnect() {
    setIsConnected(false);
    setTransport("N/A");
  }

  async function fetchTasksAndUpdateState() {
    const tasksData = await fetchTasks();
    setTasks(tasksData);
  }

  async function fetchColumnsAndUpdateState() {
    const columnsData = await fetchColumns();
    setColumns(columnsData);
  }

  async function checkSession() {
    const sessionData = await getSession();
    setSession(sessionData);
  }

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
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        socket.emit("newTask", "Hello Server");
      } else {
        console.error("Failed to delete task:", response.status);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
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

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: changeTask.id, task: taskToUpdate }),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === changeTask.id ? changeTask : task))
        );
        socket.emit("newTask", "Hello Server");
        closeTaskEdit();
      } else {
        console.error("Failed to update task:", response.status);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
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

    let finalTasksSorted = finalTasks.map((task, index) => ({ ...task, position: index }));

    setTasks([...finalTasksSorted]);

    const finalTasksSortedSQL = finalTasksSorted.map((task) => {
      return {
        ...task,
        subtasks: task.subtasks.join(", "),
        subtaskschecked: task.subtaskschecked.join(", "),
      };
    });

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
        }
      } else {
        console.error("Failed to add task:", response.status);
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }

  function closeTaskDetail() {
    setTaskDetailModalOpen(false);
  }

  async function handleNewColumn(newColumnName) {
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newColumnName,
          position: columns.length,
          creator: session.user.name,
        }),
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
    setNewColumnModal(false);
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

  function handleCloseNewColumn() {
    setNewColumnModal(false);
  }

  if (!tasks || !columns || !users) {
    return <p>Loading</p>;
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
          <NewColumnButton onClick={() => setNewColumnModal(true)}>Neue Spalte</NewColumnButton>
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
      {newColumnModal && (
        <NewColumn onClose={handleCloseNewColumn} newColumnName={handleNewColumn}></NewColumn>
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
