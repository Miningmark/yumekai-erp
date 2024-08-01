"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Column from "@/components/socialMedia/Columns";
import AddNewPost from "@/components/socialMedia/AddNewPost";
import PostCardDetail from "@/components/socialMedia/PostCardDetail";
import PostCardEdit from "@/components/socialMedia/PostCardEdit";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import RenameColumnModal from "@/components/kanbanComponents/RenameColumnModal";
import { fetchColumns, fetchTasks, fetchUsers } from "@/utils/socialMedia/loadSocialMediaContent";
import { getSession } from "@/lib/cockieFunctions";
import { socket } from "@/app/socket";
import NewColumn from "@/components/kanbanComponents/NewColumn";

const KanbanBoard = styled.div`
  margin: 20px;
  display: flex;
  gap: 20px;
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
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

export default function SocialMedia() {
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [taskDetailId, setTaskDetailId] = useState(null);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [users, setUsers] = useState(null);
  const [columns, setColumns] = useState(null);
  const [renameColumnModalOpen, setRenameColumnModalOpen] = useState(false);
  const [columnToRename, setColumnToRename] = useState(null);
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
      setPosts(tasksData);
    }

    fetchData();
    checkSession();

    socket.on("loadNewPosts", fetchTasksAndUpdateState);
    socket.on("loadNewPostsColumns", fetchColumnsAndUpdateState);

    return () => {
      socket.off("loadNewPosts", fetchTasksAndUpdateState);
      socket.off("loadNewPostsColumns", fetchColumnsAndUpdateState);
    };
  }, []);

  async function fetchTasksAndUpdateState() {
    const tasksData = await fetchTasks();
    setPosts(tasksData);
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
      const response = await fetch("/api/posts/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: taskId, deletedBy: session.user.name }),
      });

      if (response.ok) {
        setTaskDetailModalOpen(false);
        setTaskDetailId(null);
        setPosts((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        socket.emit("newPosts", "Hello Server");
      } else {
        console.error("Fehler beim Löschen der Aufgabe:", response.status);
      }
    } catch (error) {
      console.error("Fehler beim Löschen der Aufgabe:", error);
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

      const response = await fetch("/api/posts/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: changeTask.id, task: taskToUpdate }),
      });

      if (response.ok) {
        setPosts((prevTasks) =>
          prevTasks.map((task) => (task.id === changeTask.id ? changeTask : task))
        );
        socket.emit("newPosts", "Hello Server");
        closeTaskEdit();
      } else {
        console.error("Fehler beim bearbeiten der Aufgabe:", response.status);
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Aufgabe:", error);
    }
  }

  async function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const draggedTaskId = parseInt(draggableId, 10);
    const draggedTask = posts.find((task) => task.id === draggedTaskId);

    let updatedStatus = draggedTask.status;

    if (source.droppableId !== destination.droppableId) {
      const destinationColumn = columns.find(
        (column) => column.droppableId === destination.droppableId
      );
      updatedStatus = destinationColumn ? destinationColumn.droppableId : draggedTask.status;
    }

    const updatedTasks = posts.map((task) => {
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

    setPosts([...finalTasksSorted]);

    const finalTasksSortedSQL = finalTasksSorted.map((task) => {
      return {
        ...task,
        subtasks: task.subtasks.join(", "),
        subtaskschecked: task.subtaskschecked.join(", "),
      };
    });

    // Update the task status in the database
    try {
      const response = await fetch("/api/posts/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: finalTasksSortedSQL }),
      });
      socket.emit("newPosts", "Hello Server");
      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren der Aufgabe.");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Aufgabe:", error);
      setPosts(posts);
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

      const highestTaskPosition = posts.reduce((max, task) => Math.max(max, task.position), 0);

      // Erstelle ein neues Aufgabenobjekt mit den konvertierten Zeichenfolgen
      const taskToAdd = {
        ...newTask,
        subtasks: subtasksString,
        subtaskschecked: subtasksCheckedString,
        position: highestTaskPosition + 1,
      };

      const response = await fetch("/api/posts/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskToAdd }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.insertId) {
          setPosts([
            ...posts,
            { ...newTask, position: highestTaskPosition + 1, id: responseData.insertId },
          ]);
          socket.emit("newPosts", "Hello Server");
          closeAddNewTask();
        } else {
          console.error("Fehler beim erstellen der Aufgabe: Antwort enthält keine insertId");
        }
      } else {
        console.error("Fehler beim erstellen der Aufgabe:", response.status);
      }
    } catch (error) {
      console.error("Fehler beim erstellen der Aufgabe:", error);
    }
  }

  function closeTaskDetail() {
    setTaskDetailModalOpen(false);
  }

  async function handleNewColumn(newColumnName) {
    try {
      const response = await fetch("/api/posts/columns", {
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
        socket.emit("newPostsColumn", "Hello Server");
      } else {
        console.error("Fehler beim erstellen der Spalte:", response.status);
      }
    } catch (error) {
      console.error("Fehler beim erstellen der Spalte:", error);
    }
    setNewColumnModal(false);
  }

  async function renameColumn(columnId, newTitle) {
    try {
      const response = await fetch("/api/posts/columns", {
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
        socket.emit("newPostsColumn", "Hello Server");
      } else {
        console.error("Fehler beim umbenennen der Spalte:", response.status);
      }
    } catch (error) {
      console.error("Fehler beim umbenennen der Spalte:", error);
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

  if (!posts || !columns || !users) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h1>Social Media Kalender</h1>
      <AddButton onClick={() => setNewTaskModalOpen(true)}>Neuer Eintrag</AddButton>
      <DragDropContext onDragEnd={handleDragEnd}>
        <KanbanBoard>
          {columns.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              tasks={posts.filter((task) => task.status === column.droppableId)}
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
        <AddNewPost
          addNewTask={addNewTask}
          handleCloseAddNewTask={closeAddNewTask}
          columns={columns}
          editors={users.map((user) => user.name)}
          session={session}
        />
      )}

      {taskDetailModalOpen && (
        <PostCardDetail
          task={posts.find((task) => task.id == taskDetailId)}
          handleCloseTaskDetail={closeTaskDetail}
          handleDeleteTask={deleteTask}
          handleOpenTaskEdit={openTaskEdit}
          handleEditTask={editTask}
        />
      )}

      {taskEditMode && (
        <PostCardEdit
          task={posts.find((task) => task.id == taskDetailId)}
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
