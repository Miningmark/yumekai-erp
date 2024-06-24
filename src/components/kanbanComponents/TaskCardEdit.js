import styled from "styled-components";
import { useState } from "react";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

// Import SVG icons
import IconClose from "/public/assets/icons/close.svg";
import IconAdd from "/public/assets/icons/add.svg";

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

const EditModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  z-index: 105;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  max-height: 80vh;
  overflow: auto;
  border-radius: var(--border-radius);
  cursor: default;
  color: var(--dark);
  background-color: var(--grey);
`;

const CloseIcon = styled(IconClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  fill: var(--dark);
  width: 35px;
  height: 35px;

  :hover {
    fill: var(--danger);
  }
`;

const DeleteIcon = styled(IconClose)`
  width: 25px;
  height: 25px;
`;

const DeleteButton = styled(RedButton)`
  padding: 0;
  width: 30px;
  min-width: 30px;
  position: absolute;
  top: 0px;
  right: -10px;
`;

const InputField = styled.input`
  display: block;
  width: 90%;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  display: block;
  width: 90%;
  margin-bottom: 10px;
`;

const ListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  height: 35px;
`;

const AddIcon = styled(IconAdd)`
  fill: var(--dark);
  width: 30px;
  height: 30px;
`;

const NewTaskContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export default function TaskCardEdit({ task, handleCloseTaskEdit, handleEditTask, editors }) {
  const [editTask, setEditTask] = useState(task);
  const [error, setError] = useState("");

  // Function to handle input change
  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditTask({ ...editTask, [name]: value });
  }

  // Function to handle subtask change
  const handleSubtaskChange = (e, index) => {
    const updatedSubtasks = editTask.subtasks.map((subtask, i) =>
      i === index ? e.target.value : subtask
    );
    setEditTask({ ...editTask, subtasks: updatedSubtasks });
  };

  // Function to add a new subtask
  const addNewSubtask = () => {
    setEditTask({
      ...editTask,
      subtasks: [...editTask.subtasks, ""],
      subtaskschecked: [...editTask.subtaskschecked, false],
    });
  };

  // Function to save edited task
  const saveEditTask = () => {
    if (!editTask.title.trim()) {
      setError("Bitte geben Sie einen Titel ein.");
      return;
    }

    if (editTask.subtasks.some((subtask) => !subtask.trim())) {
      setError("Teilaufgaben dürfen nicht leer sein.");
      return;
    }

    setError("");
    handleEditTask(editTask);
  };

  // Function to handle editor selection
  const handleEditorChange = (e) => {
    setEditTask({ ...editTask, editor: e.target.value });
  };

  return (
    <>
      <Overlay onClick={handleCloseTaskEdit}>
        <EditModalContent onClick={(e) => e.stopPropagation()}>
          <CloseIcon onClick={handleCloseTaskEdit} />
          <h2>Bearbeiten</h2>
          <p>Titel</p>
          <InputField
            type="text"
            name="title"
            value={editTask.title}
            onChange={handleInputChange}
          />
          <p>Beschreibung</p>
          <TextArea name="description" value={editTask.description} onChange={handleInputChange} />
          <p>Bearbeiter</p>
          <select value={task.editor} onChange={handleEditorChange}>
            <option value="">-- Bitte wählen --</option>
            {editors.map((editor, index) => (
              <option key={index} value={editor}>
                {editor}
              </option>
            ))}
          </select>
          <p>Teilaufgaben</p>
          <ul>
            {editTask.subtasks.map((subtask, index) => (
              <ListItem key={index}>
                <InputField
                  type="text"
                  value={subtask}
                  onChange={(e) => handleSubtaskChange(e, index)}
                />
                <DeleteButton
                  key={index}
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
                  <DeleteIcon />
                </DeleteButton>
              </ListItem>
            ))}
          </ul>
          <NewTaskContainer>
            <GreenButton onClick={addNewSubtask}>
              <AddIcon /> neue Teilaufgabe
            </GreenButton>
          </NewTaskContainer>
          <GreenButton onClick={saveEditTask}>Speichern</GreenButton>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </EditModalContent>
      </Overlay>
    </>
  );
}
