import styled from "styled-components";
import { useState } from "react";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import { ModalOverlay, ModalContent } from "@/components/styledComponents/ModalComponents";

// Import SVG icons
import IconMoreVert from "/public/assets/icons/more_vert.svg";
import IconClose from "/public/assets/icons/close.svg";

const MiniModal = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border: 1px solid #888;
  border-radius: var(--border-radius);
  padding: 10px;
  display: ${({ $show }) => $show};
  background-color: var(--light);
  color: var(--dark);

  p {
    cursor: pointer;
  }

  svg {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 24px;
    height: 24px;
    fill: var(--dark);
  }
`;

const ConfirmationModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #888;
  background-color: var(--light);
  color: var(--dark);
  color: var();
  border-radius: var(--border-radius);
  padding: 20px;
  display: ${({ $show }) => $show};
  max-width: 250px;

  button {
    cursor: pointer;
    margin: 5px;
  }
`;

const SubtaskItem = styled.li`
  list-style-type: none;
  cursor: pointer;
  padding-bottom: 5px;
`;

const TaskInfo = styled.div`
  position: absolute;
  right: 10px;
  font-size: 12px;
  color: var(--dark);
  text-align: right;

  p {
    margin: 0;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-top: 10px;
`;

export default function TaskCardDetail({
  task,
  handleCloseTaskDetail,
  handleEditTask,
  handleDeleteTask,
  handleOpenTaskEdit,
}) {
  const { title, description, subtasks, subtaskschecked, creator, created } = task;
  const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  function openMiniModal() {
    setIsMiniModalOpen(true);
  }

  function closeMiniModal() {
    setIsMiniModalOpen(false);
  }

  function handleDelete() {
    setIsMiniModalOpen(false);
    setIsConfirmDeleteOpen(true);
  }

  function closeConfirmDelete() {
    setIsConfirmDeleteOpen(false);
  }
  function confirmDelete(taskId) {
    handleDeleteTask(taskId);
    setIsConfirmDeleteOpen(false);
  }

  function toggleCheckbox(index) {
    const updatedChecked = subtaskschecked.map((checked, i) => (i === index ? !checked : checked));
    handleEditTask({ ...task, subtaskschecked: updatedChecked });
  }

  function miniModalEdit() {
    setIsMiniModalOpen(false);
    handleOpenTaskEdit();
  }

  return (
    <>
      <ModalOverlay onClick={handleCloseTaskDetail}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <IconMoreVert onClick={openMiniModal} />
          <MiniModal $show={isMiniModalOpen ? "block" : "none"}>
            <IconClose onClick={closeMiniModal} />
            <p onClick={handleDelete}>Löschen</p>
            <p onClick={miniModalEdit}>Bearbeiten</p>
          </MiniModal>
          <h2>{title}</h2>
          <p>{description}</p>

          {subtasks.map((subtask, index) => (
            <SubtaskItem key={index} onClick={() => toggleCheckbox(index)}>
              <input
                type="checkbox"
                checked={subtaskschecked[index]}
                onChange={() => toggleCheckbox(index)}
              />
              {`  ${subtask}`}
            </SubtaskItem>
          ))}
          <br />

          <div>
            <TaskInfo>
              <p>Erstellt von: {creator}</p>
              <p>Am: {created}</p>
            </TaskInfo>
            <StyledButton onClick={handleCloseTaskDetail}>Schließen</StyledButton>
          </div>
        </ModalContent>
        {isConfirmDeleteOpen && (
          <ModalOverlay onClick={(e) => e.stopPropagation()}>
            <ConfirmationModal>
              <p>Bist du sicher, dass du diese Aufgabe löschen möchtest?</p>
              <ButtonContainer>
                <GreenButton onClick={() => confirmDelete(task.id)}>Ja</GreenButton>
                <RedButton onClick={closeConfirmDelete}>Nein</RedButton>
              </ButtonContainer>
            </ConfirmationModal>
          </ModalOverlay>
        )}
      </ModalOverlay>
    </>
  );
}
