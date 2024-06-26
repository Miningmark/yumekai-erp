import styled from "styled-components";

// Import SVG icons
import IconClose from "/public/assets/icons/close.svg";

export const ModalOverlay = styled.div`
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

export const ModalInputField = styled.input`
  display: block;
  width: 90%;
  margin-bottom: 10px;
`;

export const ModalTextArea = styled.textarea`
  display: block;
  width: 90%;
  margin-bottom: 10px;
`;

export const ModalSubtaskInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  input {
    margin-right: 8px;
  }
`;

export const ModalButtonRightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

export const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  z-index: 105;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  border-radius: var(--border-radius);
  color: var(--dark);
  background-color: var(--grey);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  svg {
    fill: var(--dark);
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

export const ModalCloseIcon = styled(IconClose)`
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

export const ModalImputTitle = styled.p`
  margin-bottom: 5px;
`;
