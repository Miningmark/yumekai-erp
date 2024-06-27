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

export default function TaskCardEdit({ task, handleCloseTaskEdit, handleEditTask, editors }) {
  const [editTask, setEditTask] = useState(task);
  const [error, setError] = useState("");

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditTask({ ...editTask, [name]: value });
  }

  const handleSubtaskChange = (e, index) => {
    const updatedSubtasks = editTask.subtasks.map((subtask, i) =>
      i === index ? e.target.value : subtask
    );
    setEditTask({ ...editTask, subtasks: updatedSubtasks });
  };

  const addNewSubtask = () => {
    setEditTask({
      ...editTask,
      subtasks: [...editTask.subtasks, ""],
      subtaskschecked: [...editTask.subtaskschecked, false],
    });
  };

  const saveEditTask = () => {
    if (!editTask.title.trim()) {
      setError("Bitte geben Sie einen Titel ein.");
      return;
    }
    if (editTask.title.length > 20) {
      setError("Bitte geben Sie einen kürzeren Titel ein.");
      return;
    }

    if (editTask.subtasks.some((subtask) => !subtask.trim())) {
      setError("Teilaufgaben dürfen nicht leer sein.");
      return;
    }

    setError("");
    handleEditTask(editTask);
  };

  const handleEditorChange = (e) => {
    setEditTask({ ...editTask, editor: e.target.value });
  };

  return (
    <>
      <ModalOverlay onClick={handleCloseTaskEdit}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalCloseIcon onClick={handleCloseTaskEdit} />
          <h2>Bearbeiten</h2>
          <ModalImputTitle>Titel</ModalImputTitle>
          <ModalInputField
            type="text"
            name="title"
            value={editTask.title}
            onChange={handleInputChange}
            maxLength={21}
          />
          <CharacterCount $tooLong={editTask.title.length > 20 ? "var(--danger)" : "var(--dark)"}>
            {editTask.title.length}/20 Zeichen
          </CharacterCount>
          <ModalImputTitle>Beschreibung</ModalImputTitle>
          <ModalTextArea
            name="description"
            value={editTask.description}
            onChange={handleInputChange}
            rows="4"
          />
          <ModalImputTitle>Bearbeiter</ModalImputTitle>
          <select value={editTask.editor} onChange={handleEditorChange}>
            {editors.map((editor, index) => (
              <option key={index} value={editor}>
                {editor}
              </option>
            ))}
          </select>
          <p>Teilaufgaben</p>

          {editTask.subtasks.map((subtask, index) => (
            <ModalSubtaskInput key={index}>
              <ModalInputField
                type="text"
                value={subtask}
                onChange={(e) => handleSubtaskChange(e, index)}
              />
              <RedButton
                onClick={() => {
                  const updatedSubtasks = editTask.subtasks.filter((_, i) => i !== index);
                  const updatedChecked = editTask.subtaskschecked.filter((_, i) => i !== index);
                  setEditTask({
                    ...editTask,
                    subtasks: updatedSubtasks,
                    subtaskschecked: updatedChecked,
                  });
                }}
              >
                Löschen
              </RedButton>
            </ModalSubtaskInput>
          ))}

          <StyledButton onClick={addNewSubtask}>neue Teilaufgabe</StyledButton>
          <ModalButtonRightContainer>
            <GreenButton onClick={saveEditTask}>Speichern</GreenButton>
          </ModalButtonRightContainer>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </ModalContent>
      </ModalOverlay>
    </>
  );
}
