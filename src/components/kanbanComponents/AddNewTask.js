import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const TaskFormContainer = styled.div`
  color: var(--dark);
  background-color: var(--grey);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  max-height: 80vh;
  overflow: auto;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SubtaskInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  input {
    margin-right: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

export default function AddNewTask({ addNewTask, handleCloseAddNewTask, columns, editors }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(columns[0].id);
  const [description, setDescription] = useState("");
  const [editor, setEditor] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState("");

  function handleSubtaskChange(index, value) {
    const newSubtasks = [...subtasks];
    newSubtasks[index].text = value;
    setSubtasks(newSubtasks);
  }

  function addSubtask() {
    setSubtasks([...subtasks, { text: "" }]);
  }

  function onSubmit() {
    if (!title.trim()) {
      setError("Bitte geben Sie einen Titel ein.");
      return;
    }

    if (!editor) {
      setError("Bitte wählen Sie einen Editor aus.");
      return;
    }

    if (subtasks.some((subtask) => !subtask.text.trim())) {
      setError("Teilaufgaben dürfen nicht leer sein.");
      return;
    }

    setError("");

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

    const newTask = {
      title,
      status,
      description,
      editor,
      subtasks: subtasks.map((subtask) => subtask.text),
      subtaskschecked: subtasks.map(() => false),
      creator: session?.user?.name || "Unknown",
      created: formattedDate,
    };
    addNewTask(newTask);
  }

  return (
    <Overlay onClick={handleCloseAddNewTask}>
      <TaskFormContainer onClick={(e) => e.stopPropagation()}>
        <h2>Add New Task</h2>
        <p>Title</p>
        <input
          type="text"
          placeholder="e.g. Take a coffee break"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>Description</p>
        <input
          type="text"
          placeholder="e.g. It's always good to take a break."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p>Status</p>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.title}
            </option>
          ))}
        </select>
        <p>Editor</p>
        <select value={editor} onChange={(e) => setEditor(e.target.value)}>
          <option value="">-- Bitte wählen --</option>
          {editors.map((editorName, index) => (
            <option key={index} value={editorName}>
              {editorName}
            </option>
          ))}
        </select>
        <p>Subtasks</p>
        {subtasks.map((subtask, index) => (
          <SubtaskInput key={index}>
            <input
              type="text"
              placeholder="new Subtask"
              value={subtask.text}
              onChange={(e) => handleSubtaskChange(index, e.target.value)}
            />
          </SubtaskInput>
        ))}
        <StyledButton onClick={addSubtask}>Add Subtask</StyledButton>
        <ButtonContainer>
          <GreenButton onClick={onSubmit}>Create New Task</GreenButton>
        </ButtonContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </TaskFormContainer>
    </Overlay>
  );
}
