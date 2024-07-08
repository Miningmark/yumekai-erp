import { useState, useRef } from "react";
import styled from "styled-components";
import {
  ModalOverlay,
  ModalInputField,
  ModalTextArea,
  ModalSubtaskInput,
  ModalButtonRightContainer,
  ModalContent,
  ModalCloseIcon,
  ModalImputTitle,
  ModalInputWrapper,
  ModalContentLarge,
  InputFieldsContainer,
} from "@/components/styledComponents/ModalComponents";

import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import { inputComponentConStandType } from "@/components/contactComponents/InputComponents";
import { newConStandTemplate, allColumns } from "@/utils/conStand/helpers";

export default function DisplayConventionStandModal({ stand, onClose, onEditStand }) {
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableStand, setEditableStand] = useState(stand);

  // Refs für die Input-Felder
  const locationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const conNameRef = useRef(null);

  // Funktion zum Fokussieren des Inputs
  function focusInput(ref) {
    if (ref.current) {
      ref.current.focus();
    }
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSaveClick() {
    if (!editableStand.location) {
      setError("Location is required");
      focusInput(locationRef);
      return;
    }
    if (!editableStand.start_date) {
      setError("Start date is required");
      focusInput(startDateRef);
      return;
    }
    if (!editableStand.end_date) {
      setError("End date is required");
      focusInput(endDateRef);
      return;
    }
    if (!editableStand.con_name) {
      setError("Convention name is required");
      focusInput(conNameRef);
      return;
    }
    console.log("editableStand: ", editableStand);
    onEditStand(editableStand);
    onClose();
  }

  const handleChange = (field, value) => {
    setEditableStand((prev) => ({ ...prev, [field]: value }));
  };

  function renderInputFields() {
    return Array.from(allColumns).map((column) => {
      const Component = inputComponentConStandType[column.id];
      if (!Component) return null;

      return (
        <Component
          key={column.id}
          title={column.name}
          inputText={editableStand[column.id]}
          inputChange={(value) => handleChange(column.id, value)}
          type={column.id === "start_date" ? "date" : column.id === "end_date" ? "date" : "text"}
          inputRef={
            column.id === "con_name"
              ? conNameRef
              : column.id === "location"
              ? locationRef
              : column.id === "start_date"
              ? startDateRef
              : column.id === "end_date"
              ? endDateRef
              : null
          }
          editable={isEditing}
        />
      );
    });
  }

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContentLarge onClick={(e) => e.stopPropagation()}>
          <ModalCloseIcon onClick={onClose} />
          <h2>New Convention Stand</h2>
          <InputFieldsContainer>{renderInputFields()}</InputFieldsContainer>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <ModalButtonRightContainer>
            {isEditing ? (
              <GreenButton onClick={handleSaveClick}>Speichern</GreenButton>
            ) : (
              <StyledButton onClick={handleEditClick}>Bearbeiten</StyledButton>
            )}
            <RedButton onClick={onClose}>Schließen</RedButton>
          </ModalButtonRightContainer>
        </ModalContentLarge>
      </ModalOverlay>
    </>
  );
}
