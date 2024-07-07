import { useState } from "react";
import styled from "styled-components";
import {
  GreenButton,
  RedButton,
  DisabledGreenButton,
} from "@/components/styledComponents/StyledButton";

import CharacterCount from "@/components/styledComponents/CharacterCount";
import { ModalOverlay, ModalContent } from "@/components/styledComponents/ModalComponents";

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export default function NewColumn({ onClose, newColumnName }) {
  const [newTitle, setNewTitle] = useState("");
  const maxLength = 16;
  const tooLong = newTitle.length > maxLength;

  const handleRename = () => {
    if (!tooLong) {
      newColumnName(newTitle);
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Neue Spalte</ModalTitle>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          maxLength={maxLength + 1}
        />
        <CharacterCount $tooLong={tooLong ? 1 : 0}>
          {newTitle.length}/{maxLength} zeichen
        </CharacterCount>
        <ModalActions>
          <RedButton onClick={onClose}>Abbrechen</RedButton>
          {tooLong || newTitle.length == 0 ? (
            <DisabledGreenButton disabled>Speichern</DisabledGreenButton>
          ) : (
            <GreenButton onClick={handleRename}>Speichern</GreenButton>
          )}
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
}
