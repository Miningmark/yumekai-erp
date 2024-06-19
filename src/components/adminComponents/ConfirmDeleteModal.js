import styled from "styled-components";
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

const ConfirmContainer = styled.div`
  color: var(--dark);
  background-color: var(--grey);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-top: 10px;
`;

export default function ConfirmDeleteModal({ handleClose, handleConfirm }) {
  return (
    <Overlay onClick={handleClose}>
      <ConfirmContainer onClick={(e) => e.stopPropagation()}>
        <h1>Sind Sie sicher?</h1>
        <p>
          Möchten Sie diesen Benutzer wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht
          werden.
        </p>
        <ButtonContainer>
          <RedButton onClick={handleClose}>Abbrechen</RedButton>
          <GreenButton onClick={handleConfirm}>Bestätigen</GreenButton>
        </ButtonContainer>
      </ConfirmContainer>
    </Overlay>
  );
}
