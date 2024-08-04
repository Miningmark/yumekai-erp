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
import HelperSelectionModal from "@/components/conventionStandComponents/HelperSelectionModal";

export default function DisplayConventionStandModal({ stand, onClose, onEditStand, allHelpers }) {
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableStand, setEditableStand] = useState(stand);
  const [showHelperModal, setShowHelperModal] = useState(false);

  // Refs für die Input-Felder
  const locationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const conNameRef = useRef(null);
  const websiteRef = useRef(null);

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

    onEditStand(editableStand);
    onClose();
  }

  function handleChange(field, value) {
    setEditableStand((prev) => ({ ...prev, [field]: value }));
  }

  function handleOpenHelperModal() {
    setShowHelperModal(true);
  }

  function renderInputFields() {
    return Array.from(allColumns).map((column) => {
      const Component = inputComponentConStandType[column.id];
      if (!Component) return null;

      return (
        <Component
          key={column.id}
          title={column.name}
          inputText={
            column.id === "helpers"
              ? editableStand.helpers
                  .map((helperID) => {
                    const helperData = allHelpers.find((helper) => helper.id == helperID);
                    return `${helperData.given_name} ${helperData.surname}`;
                  })
                  .join(", ")
              : editableStand[column.id]
          }
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
              : column.id === "website"
              ? websiteRef
              : null
          }
          editable={isEditing}
          handleOnClick={
            isEditing ? (column.id === "helpers" ? handleOpenHelperModal : null) : null
          }
        />
      );
    });
  }

  function handleAddHelpers(helpersIDs) {
    handleChange("helpers", helpersIDs);
  }

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContentLarge onClick={(e) => e.stopPropagation()}>
          <ModalCloseIcon onClick={onClose} />
          <h2>Infostand</h2>
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
      {showHelperModal && (
        <HelperSelectionModal
          onClose={() => setShowHelperModal(false)}
          onSelectHelpers={handleAddHelpers}
          selectedHelpers={editableStand.helpers}
          allHelpers={allHelpers.filter((helper) => helper.stand_helper == true)}
        />
      )}
    </>
  );
}
