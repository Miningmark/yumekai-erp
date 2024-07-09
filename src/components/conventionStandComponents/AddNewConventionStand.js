import React, { useState, useRef } from "react";
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

import { GreenButton } from "@/components/styledComponents/StyledButton";
import { inputComponentConStandType } from "@/components/contactComponents/InputComponents";
import { newConStandTemplate, allColumns } from "@/utils/conStand/helpers";
import HelperSelectionModal from "@/components/conventionStandComponents/HelperSelectionModal";

export default function AddNewConventionStand({ onClose, onAdd, allHelpers }) {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(newConStandTemplate);
  const [showHelperModal, setShowHelperModal] = useState(false);

  const locationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const conNameRef = useRef(null);
  const websiteRef = useRef(null);

  const focusInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const onSubmit = () => {
    if (!formData.location) {
      setError("Location is required");
      focusInput(locationRef);
      return;
    }
    if (!formData.start_date) {
      setError("Start date is required");
      focusInput(startDateRef);
      return;
    }
    if (!formData.end_date) {
      setError("End date is required");
      focusInput(endDateRef);
      return;
    }
    if (!formData.con_name) {
      setError("Convention name is required");
      focusInput(conNameRef);
      return;
    }

    onAdd(formData);
    onClose();
  };

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              ? formData.helpers
                  .map((helperID) => {
                    const helperData = allHelpers.find((helper) => helper.id == helperID);
                    return `${helperData.given_name} ${helperData.surname}`;
                  })
                  .join(", ")
              : formData[column.id]
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
          handleOnClick={column.id === "helpers" ? handleOpenHelperModal : null}
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
          <h2>Neuer Infostand</h2>
          <InputFieldsContainer>{renderInputFields()}</InputFieldsContainer>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          <ModalButtonRightContainer>
            <GreenButton onClick={onSubmit}>Speichern</GreenButton>
          </ModalButtonRightContainer>
        </ModalContentLarge>
      </ModalOverlay>
      {showHelperModal && (
        <HelperSelectionModal
          onClose={() => setShowHelperModal(false)}
          onSelectHelpers={handleAddHelpers}
          selectedHelpers={formData.helpers}
          allHelpers={allHelpers}
        />
      )}
    </>
  );
}
