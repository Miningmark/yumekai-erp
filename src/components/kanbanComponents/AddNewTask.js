import { useState } from "react";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import CharacterCount from "@/components/styledComponents/CharacterCount";
import {
  ModalOverlay,
  ModalInputField,
  ModalTextArea,
  ModalSubtaskInput,
  ModalButtonRightContainer,
  ModalContent,
  ModalCloseIcon,
  ModalImputTitle,
} from "@/components/styledComponents/ModalComponents";

export default function AddNewTask({
  addNewTask,
  handleCloseAddNewTask,
  columns,
  editors,
  session,
}) {
  const [title, setTitle] = useState("");
  const [column, setColumn] = useState("");
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

  function deleteSubtask(index) {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  }

  function onSubmit() {
    if (!title.trim()) {
      setError("Bitte geben Sie einen Titel ein.");
      return;
    }
    if (title.length > 20) {
      setError("Bitte geben Sie einen kürzeren Titel ein.");
      return;
    }

    if (!column) {
      setError("Bitte wählen Sie einen Spalte aus.");
      return;
    }

    if (!editor) {
      setError("Bitte wählen Sie einen Bearbeiter aus.");
      return;
    }

    if (subtasks.some((subtask) => !subtask.text.trim())) {
      setError("Teilaufgaben dürfen nicht leer sein.");
      return;
    }

    setError("");

    const newTask = {
      title,
      status: columns.find((columnTable) => columnTable.title == column).droppableId,
      description,
      editor,
      subtasks: subtasks.map((subtask) => subtask.text),
      subtaskschecked: subtasks.map(() => false),
      creator: session?.user?.name || "Unknown",
    };
    addNewTask(newTask);
  }

  return (
    <ModalOverlay onClick={handleCloseAddNewTask}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={handleCloseAddNewTask} />
        <h2>Neue Aufgabe </h2>
        <ModalImputTitle>Titel</ModalImputTitle>
        <ModalInputField
          type="text"
          placeholder="e.g. Take a coffee break"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={21}
        />
        <CharacterCount $tooLong={title.length > 20 ? 1 : 0}>
          {title.length}/20 Zeichen
        </CharacterCount>
        <ModalImputTitle>Beschreibung</ModalImputTitle>
        <ModalTextArea
          type="text"
          placeholder="e.g. It's always good to take a break."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
        <ModalImputTitle>Spalte</ModalImputTitle>
        <select value={column} onChange={(e) => setColumn(e.target.value)}>
          <option value="">-- Bitte wählen --</option>
          {columns.map((column) => (
            <option key={column.id} value={column.title}>
              {column.title}
            </option>
          ))}
        </select>
        <ModalImputTitle>Bearbeiter</ModalImputTitle>
        <select value={editor} onChange={(e) => setEditor(e.target.value)}>
          <option value="">-- Bitte wählen --</option>
          {editors.map((editorName, index) => (
            <option key={index} value={editorName}>
              {editorName}
            </option>
          ))}
        </select>
        <p>Teilaufgaben</p>
        {subtasks.map((subtask, index) => (
          <ModalSubtaskInput key={index}>
            <ModalInputField
              type="text"
              placeholder="Neue Teilaufgabe"
              value={subtask.text}
              onChange={(e) => handleSubtaskChange(index, e.target.value)}
            />
            <RedButton onClick={() => deleteSubtask(index)}>Löschen</RedButton>
          </ModalSubtaskInput>
        ))}
        <StyledButton onClick={addSubtask}>weitere Teilaufgabe</StyledButton>
        <ModalButtonRightContainer>
          <GreenButton onClick={onSubmit}>Aufgabe Speichern</GreenButton>
        </ModalButtonRightContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </ModalContent>
    </ModalOverlay>
  );
}
