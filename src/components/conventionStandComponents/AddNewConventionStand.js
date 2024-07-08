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

export default function AddNewConventionStand({ onClose, onAdd }) {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(newConStandTemplate);

  const locationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const conNameRef = useRef(null);

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
    console.log("formData: ", formData);

    onAdd(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function renderInputFields() {
    return Array.from(allColumns).map((column) => {
      const Component = inputComponentConStandType[column.id];
      if (!Component) return null;

      return (
        <Component
          key={column.id}
          title={column.name}
          inputText={formData[column.id]}
          inputChange={(value) => handleChange(column.id, value)}
          type={column.id === "start_date" ? "date" : column.id === "end_date" ? "date" : "text"}
          inputRef={
            column.id === "given_name"
              ? givenNameRef
              : column.id === "surname"
              ? surnameRef
              : column.id === "postal_code"
              ? postal_codeRef
              : null
          }
        />
      );
    });
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContentLarge onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={onClose} />
        <h2>New Convention Stand</h2>
        <InputFieldsContainer>{renderInputFields()}</InputFieldsContainer>
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        <ModalButtonRightContainer>
          <GreenButton onClick={onSubmit}>Speichern</GreenButton>
        </ModalButtonRightContainer>
      </ModalContentLarge>
    </ModalOverlay>
  );
}
