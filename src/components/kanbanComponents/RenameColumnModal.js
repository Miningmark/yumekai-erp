import { useState } from "react";
import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  color: var(--dark);
  background-color: var(--grey);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CharCount = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: ${(props) => props.$tooLong};
`;

const DisabledGreenButton = styled(GreenButton)`
  opacity: 0.5;
  cursor: not-allowed;
`;

export default function RenameColumnModal({ column, onClose, onRename }) {
  const [newTitle, setNewTitle] = useState(column.title);
  const maxLength = 16;
  const tooLong = newTitle.length > maxLength;

  const handleRename = () => {
    if (!tooLong) {
      onRename(column.id, newTitle);
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Spalte umbenennen</ModalTitle>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          maxLength={maxLength + 1}
        />
        <CharCount $tooLong={tooLong ? "var(--danger)" : "var(--dark)"}>
          {newTitle.length}/{maxLength} zeichen
        </CharCount>
        <ModalActions>
          <RedButton onClick={onClose}>Abbrechen</RedButton>
          {tooLong ? (
            <DisabledGreenButton disabled>Umbenennen</DisabledGreenButton>
          ) : (
            <GreenButton onClick={handleRename}>Umbenennen</GreenButton>
          )}
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
}
